"""
RAG Pipeline - Combines retrieval and LLM generation with strict grounding.
"""

from typing import Optional
from langchain_core.documents import Document

from vector_store import (
    load_vector_store,
    similarity_search_with_score,
    create_vector_store,
    add_documents
)
from llm_service import generate_response, generate_response_stream, check_ollama_health
from document_loader import load_document
from chunker import chunk_documents


# Similarity threshold - chunks below this score are considered irrelevant
# Note: ChromaDB returns distance (lower = more similar), so we use < threshold
SIMILARITY_THRESHOLD = 1.0  # Adjust based on testing (typical range: 0.5 - 1.5)


SYSTEM_PROMPT = """Tu es un assistant qui répond UNIQUEMENT à partir des documents fournis ci-dessous.

RÈGLES STRICTES - NE JAMAIS LES ENFREINDRE:
1. Réponds UNIQUEMENT avec les informations présentes dans le contexte ci-dessous.
2. Si l'information n'est PAS dans le contexte, réponds EXACTEMENT: "Je n'ai pas trouvé cette information dans les documents disponibles."
3. NE JAMAIS inventer, deviner ou utiliser des connaissances externes.
4. NE JAMAIS dire "d'après mes connaissances" ou "généralement" - utilise SEULEMENT le contexte.
5. Cite toujours la source: "[Document X]" quand tu donnes une information.
6. Si la question est hors-sujet par rapport aux documents, dis-le clairement.
7. Réponds dans la langue de la question.
8. Sois concis et précis.

IMPORTANT: Si tu n'es pas sûr à 100% que l'information vient du contexte, réponds que tu ne sais pas."""


def build_prompt(question: str, context_docs: list[tuple[Document, float]]) -> str:
    """
    Build the prompt with context for the LLM.
    
    Args:
        question: User's question
        context_docs: List of (Document, score) tuples from retrieval
        
    Returns:
        Formatted prompt string
    """
    if not context_docs:
        context_text = "No relevant context found."
    else:
        context_parts = []
        for i, (doc, score) in enumerate(context_docs, 1):
            source = doc.metadata.get("source", "Unknown")
            context_parts.append(f"[Document {i}] (Source: {source})\n{doc.page_content}")
        context_text = "\n\n".join(context_parts)
    
    prompt = f"""Context:
{context_text}

Question: {question}

Answer:"""
    
    return prompt


def filter_by_relevance(
    docs_with_scores: list[tuple[Document, float]],
    threshold: float = SIMILARITY_THRESHOLD
) -> list[tuple[Document, float]]:
    """
    Filter documents by relevance score.
    
    Args:
        docs_with_scores: List of (Document, score) tuples
        threshold: Maximum distance threshold (lower = more similar)
        
    Returns:
        Filtered list of relevant documents
    """
    # ChromaDB returns L2 distance - lower is better
    return [(doc, score) for doc, score in docs_with_scores if score < threshold]


def query(
    question: str,
    persist_directory: str = "./chroma_db",
    collection_name: str = "documents",
    k: int = 4,
    threshold: float = SIMILARITY_THRESHOLD,
    model: str = "mistral"
) -> dict:
    """
    Execute a RAG query: retrieve relevant documents and generate an answer.
    
    Args:
        question: User's question
        persist_directory: ChromaDB persist directory
        collection_name: Collection name in ChromaDB
        k: Number of documents to retrieve
        threshold: Similarity threshold for filtering
        model: Ollama model to use
        
    Returns:
        Dictionary with answer, sources, and metadata
    """
    # Check Ollama health
    if not check_ollama_health():
        return {
            "answer": "Error: LLM service is not available. Please ensure Ollama is running.",
            "sources": [],
            "error": True
        }
    
    # Load vector store
    try:
        vector_store = load_vector_store(
            persist_directory=persist_directory,
            collection_name=collection_name
        )
    except Exception as e:
        return {
            "answer": "Error: Could not load the knowledge base. Please ensure documents are indexed.",
            "sources": [],
            "error": True,
            "error_message": str(e)
        }
    
    # Retrieve relevant documents
    docs_with_scores = similarity_search_with_score(
        query=question,
        vector_store=vector_store,
        k=k
    )
    
    # Filter by relevance threshold
    relevant_docs = filter_by_relevance(docs_with_scores, threshold)
    
    # Build prompt
    prompt = build_prompt(question, relevant_docs)
    
    # Generate response
    try:
        answer = generate_response(
            prompt=prompt,
            model=model,
            system_prompt=SYSTEM_PROMPT,
            temperature=0.1  # Low temperature for factual responses
        )
    except Exception as e:
        return {
            "answer": "Error: Failed to generate response from LLM.",
            "sources": [],
            "error": True,
            "error_message": str(e)
        }
    
    # Extract sources
    sources = [
        {
            "source": doc.metadata.get("source", "Unknown"),
            "content_preview": doc.page_content[:200] + "..." if len(doc.page_content) > 200 else doc.page_content,
            "relevance_score": round(1 - (score / 2), 2)  # Convert distance to similarity (0-1)
        }
        for doc, score in relevant_docs
    ]
    
    return {
        "answer": answer,
        "sources": sources,
        "documents_retrieved": len(docs_with_scores),
        "documents_used": len(relevant_docs),
        "error": False
    }


def index_files(
    file_paths: list[str],
    persist_directory: str = "./chroma_db",
    collection_name: str = "documents",
    chunk_size: int = 1000,
    chunk_overlap: int = 200
) -> dict:
    """
    Index files into the vector store.
    
    Args:
        file_paths: List of file paths to index
        persist_directory: ChromaDB persist directory
        collection_name: Collection name in ChromaDB
        chunk_size: Size of text chunks
        chunk_overlap: Overlap between chunks
        
    Returns:
        Dictionary with indexing results
    """
    try:
        # Load documents from all file paths
        documents = []
        for file_path in file_paths:
            docs = load_document(file_path)
            if docs:
                documents.extend(docs)
        
        if not documents:
            return {
                "success": False,
                "message": "No documents could be loaded from the provided paths.",
                "indexed_count": 0
            }
        
        # Chunk documents
        chunks = chunk_documents(
            documents,
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap
        )
        
        # Try to load existing vector store, or create new one
        try:
            vector_store = load_vector_store(
                persist_directory=persist_directory,
                collection_name=collection_name
            )
            add_documents(chunks, vector_store)
        except Exception:
            # Create new vector store if it doesn't exist
            vector_store = create_vector_store(
                documents=chunks,
                persist_directory=persist_directory,
                collection_name=collection_name
            )
        
        return {
            "success": True,
            "message": f"Successfully indexed {len(file_paths)} file(s) into {len(chunks)} chunks.",
            "indexed_count": len(chunks),
            "files_processed": len(file_paths)
        }
        
    except Exception as e:
        return {
            "success": False,
            "message": f"Error during indexing: {str(e)}",
            "indexed_count": 0
        }


def delete_documents(
    file_paths: list[str],
    persist_directory: str = "./chroma_db",
    collection_name: str = "documents"
) -> dict:
    """
    Delete documents from the vector store by their source file path.
    
    Args:
        file_paths: List of file paths to delete
        persist_directory: ChromaDB persist directory
        collection_name: Collection name in ChromaDB
        
    Returns:
        Dictionary with deletion results
    """
    try:
        import chromadb
        
        client = chromadb.PersistentClient(path=persist_directory)
        collection = client.get_collection(collection_name)
        
        deleted_count = 0
        for file_path in file_paths:
            # Delete by metadata filter
            collection.delete(where={"source": file_path})
            deleted_count += 1
        
        return {
            "success": True,
            "message": f"Successfully deleted documents from {deleted_count} file(s).",
            "deleted_count": deleted_count
        }
        
    except Exception as e:
        return {
            "success": False,
            "message": f"Error during deletion: {str(e)}",
            "deleted_count": 0
        }
