package com.example.etablissement.repository;

import java.util.List;
import com.example.etablissement.model.Texte;

public interface TexteRepositoryCustom { List<Texte> search(String q); }
