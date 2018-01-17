ALTER TABLE recette DROP FOREIGN KEY FK_createur_r;
ALTER TABLE ingredient DROP FOREIGN KEY FK_createur_i;
ALTER TABLE composition DROP FOREIGN KEY FK_recette_c;
ALTER TABLE composition DROP FOREIGN KEY FK_ingredient_c;
ALTER TABLE etape DROP FOREIGN KEY FK_recette_e;
ALTER TABLE planning DROP FOREIGN KEY FK_utilisateur_p;
ALTER TABLE planning DROP FOREIGN KEY FK_recette_p;

DROP TABLE recette;
DROP TABLE utilisateur;
DROP TABLE ingredient;
DROP TABLE etape;
DROP TABLE planning;
DROP TABLE composition;
