package com.example.etablissement.repository;

import java.util.List;
import com.example.etablissement.model.Etablissement;

public interface EtablissementRepositoryCustom { List<Etablissement> search(String q); }
