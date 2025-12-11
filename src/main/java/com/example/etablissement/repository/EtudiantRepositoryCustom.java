package com.example.etablissement.repository;

import java.util.List;
import com.example.etablissement.model.Etudiant;

public interface EtudiantRepositoryCustom { List<Etudiant> search(String q); }
