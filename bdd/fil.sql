INSERT INTO utilisateur (id,login,grp,nom,prenom,email,adresse,mdp) VALUES (1,'ADMIN1',2,'SCHOTT','LUCAS','LUCAS.SCHOTT97@GMAIL.COM','1 RUE X 67000 STRASBOURG','2114396121-13398227054072106111631193140');
INSERT INTO utilisateur (id,login,grp,nom,prenom,email,adresse,mdp) VALUES (2,'USER1',1,'SEEL','AUDE','AUDE.SEEL@GMAIL.COM','1 RUE Y 67000 STRASBOURG','-27725094341839359516875540131564445814');


INSERT INTO ingredient (id,nom,createur,energie,glucides,lipides,protides) VALUES (1,'PATES',1,131,25,1,5);
INSERT INTO ingredient (id,nom,createur,energie,glucides,lipides,protides) VALUES (2,'RIZ',2,130,28,0,3);
INSERT INTO ingredient (id,nom,createur,energie,glucides,lipides,protides) VALUES (3,'BEURRE',1,717,0,81,1);
INSERT INTO ingredient (id,nom,createur,energie,glucides,lipides,protides) VALUES (4,'BOEUF',2,250,0,15,26);
INSERT INTO ingredient (id,nom,createur,energie,glucides,lipides,protides) VALUES (5,'VOLAILLE',1,272,0,25,11);
INSERT INTO ingredient (id,nom,createur,energie,glucides,lipides,protides) VALUES (6,'SAUMON',1,208,0,13,20);
INSERT INTO ingredient (id,nom,createur,energie,glucides,lipides,protides) VALUES (7,'THON',1,117,0,1,25);
INSERT INTO ingredient (id,nom,createur,energie,glucides,lipides,protides) VALUES (8,'COURGETTE',2,17,3,0,1);
INSERT INTO ingredient (id,nom,createur,energie,glucides,lipides,protides) VALUES (9,'POTIRON',1,31,5,0,1);
INSERT INTO ingredient (id,nom,createur,energie,glucides,lipides,protides) VALUES (10,'TOFU',1,76,2,5,8);
INSERT INTO ingredient (id,nom,createur,energie,glucides,lipides,protides) VALUES (11,'SOJA',2,446,30,20,36);
INSERT INTO ingredient (id,nom,createur,energie,glucides,lipides,protides) VALUES (12,'HARICOT VERT',1,31,7,0,2);
INSERT INTO ingredient (id,nom,createur,energie,glucides,lipides,protides) VALUES (13,'LAIT',1,42,5,1,3);
INSERT INTO ingredient (id,nom,createur,energie,glucides,lipides,protides) VALUES (14,'OEUF',1,155,1,11,13);
INSERT INTO ingredient (id,nom,createur,energie,glucides,lipides,protides) VALUES (15,'CAROTTE',1,41,10,0,1);


INSERT INTO recette (id,nom,createur,description,difficulte,prix,nb_personnes,energie,glucides,lipides,protides,temps_preparation) VALUES (1,'PATES AU BEURRE',2,'DES PATES AVEC DU BEURRE','TRES FACILE',0,2,500,100,50,10,20);
INSERT INTO composition (id,recette,ingredient,quantite) VALUES (1,1,1,200);
INSERT INTO composition (id,recette,ingredient,quantite) VALUES (2,1,3,15);
INSERT INTO etape (id,recette,numero,description,duree) VALUES (1,1,1,'FAIRE BOUILLIRE DE L EAU DANS UNE CASSEROLLE',5);
INSERT INTO etape (id,recette,numero,description,duree) VALUES (2,1,2,'AJOUTER LES PATES DANS L EAU BOUILLANTE ET ATTENDRE 10 MINUTES',10);
INSERT INTO etape (id,recette,numero,description,duree) VALUES (3,1,3,'METTRES LES PATES DANS UN PLAT ET AJOUTER LE BEURRE, LE REPAS EST PRET',1);

INSERT INTO recette (id,nom,createur,description,difficulte,prix,nb_personnes,energie,glucides,lipides,protides,temps_preparation) VALUES (2,'RIZ VOLAILLE',1,'DU RIZ AVEC DE LA VOLAILLE','TRES FACILE',1,2,500,100,50,10,20);
INSERT INTO composition (id,recette,ingredient,quantite) VALUES (3,2,2,200);
INSERT INTO composition (id,recette,ingredient,quantite) VALUES (4,2,5,200);
INSERT INTO etape (id,recette,numero,description,duree) VALUES (4,2,1,'CUIRE LE RIZ ET LA VOLAILLE',15);
INSERT INTO etape (id,recette,numero,description,duree) VALUES (5,2,2,'ASSAISONNER',1);

INSERT INTO recette (id,nom,createur,description,difficulte,prix,nb_personnes,energie,glucides,lipides,protides,temps_preparation) VALUES (3,'SALADE DE CAROTTES',2,'DES CAROTTES CRU, ASSAISONNES','TRES FACILE',0,2,200,50,4,3,25);
INSERT INTO composition (id,recette,ingredient,quantite) VALUES (5,3,15,500);
INSERT INTO etape (id,recette,numero,description,duree) VALUES (6,3,1,'PREPARER LES CAROTTES ET LES COUPER EN FINES TRANCHES',20);



INSERT INTO planning (id,utilisateur,recette,nb_personnes,date_p) VALUES (1,1,1,2,curdate()+3);
INSERT INTO planning (id,utilisateur,recette,nb_personnes,date_p) VALUES (2,1,3,2,curdate()+4);
