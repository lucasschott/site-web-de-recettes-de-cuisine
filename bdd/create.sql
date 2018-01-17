CREATE TABLE recette(
    id INTEGER AUTO_INCREMENT,
    nom VARCHAR(50),
    createur INTEGER,
    description VARCHAR(500),
    difficulte VARCHAR(50) DEFAULT 'MOYEN',
    prix INTEGER DEFAULT 2,
    nb_personnes INTEGER,
    energie INTEGER,
    glucides INTEGER,
    lipides INTEGER,
    protides INTEGER,
    temps_preparation INTEGER,
    PRIMARY KEY (id),
    CONSTRAINT CHK_difficulte_r CHECK ('difficulte' IN ("TRES FACILE","FACILE","MOYEN","DIFFICILE")),
    CONSTRAINT CHK_prix_r CHECK (prix BETWEEN 0 AND 5),
    CONSTRAINT CHK_nb_personnes_r CHECK (nb_personnes > 0),
    CONSTRAINT CHK_temps_preparation_r CHECK (temps_preparation > 0)
);

CREATE TABLE utilisateur(
    id INTEGER AUTO_INCREMENT,
    grp INTEGER DEFAULT 1,
    login VARCHAR(50) NOT NULL UNIQUE,
    nom VARCHAR(50),
    prenom VARCHAR(50),
    email VARCHAR(50),
    mdp VARCHAR(500),
    adresse VARCHAR(200),
    PRIMARY KEY (id),
    CONSTRAINT CHK_grp_t CHECK (grp IN (0,1)),
    CONSTRAINT CHK_email_u CHECK (email like '%@%.%')
);

CREATE TABLE ingredient(
    id INTEGER AUTO_INCREMENT,
    nom VARCHAR(50),
    createur INTEGER,
    energie INTEGER,
    glucides INTEGER,
    lipides INTEGER,
    protides INTEGER,
    PRIMARY KEY (id),
    CONSTRAINT CHK_nutriments_i CHECK (energie >= 0)
);

CREATE TABLE composition(
    id INTEGER AUTO_INCREMENT,
    recette INTEGER,
    ingredient INTEGER,
    quantite INTEGER,
    PRIMARY KEY (id),
    CONSTRAINT CHK_quantite_c CHECK (quantite > 0)
);

CREATE TABLE etape(
    id INTEGER AUTO_INCREMENT,
    recette INTEGER,
    numero INTEGER,
    description VARCHAR(500),
    duree INTEGER,
    PRIMARY KEY (id),
    CONSTRAINT CHK_numero_e CHECK (numero > 0),
    CONSTRAINT CHK_duree_e CHECK (duree >=0)
);

CREATE TABLE planning(
    id INTEGER AUTO_INCREMENT,
    utilisateur INTEGER,
    recette INTEGER,
    nb_personnes INTEGER,
    date_p DATE NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT CHK_nb_personnes_p CHECK (nb_personnes > 0)
);


ALTER TABLE recette ADD CONSTRAINT FK_createur_r FOREIGN KEY (createur) REFERENCES utilisateur(id);
ALTER TABLE ingredient ADD CONSTRAINT FK_createur_i FOREIGN KEY (createur) REFERENCES utilisateur(id);
ALTER TABLE composition ADD CONSTRAINT FK_recette_c FOREIGN KEY (recette) REFERENCES recette(id);
ALTER TABLE composition ADD CONSTRAINT FK_ingredient_c FOREIGN KEY (ingredient) REFERENCES ingredient(id);
ALTER TABLE etape ADD CONSTRAINT FK_recette_e FOREIGN KEY (recette) REFERENCES recette(id);
ALTER TABLE planning ADD CONSTRAINT FK_utilisateur_p FOREIGN KEY (utilisateur) REFERENCES utilisateur(id);
ALTER TABLE planning ADD CONSTRAINT FK_recette_p FOREIGN KEY (recette) REFERENCES recette(id);
