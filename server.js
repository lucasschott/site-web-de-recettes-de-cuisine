
/*********************************require****************************/
/********************************************************************/

var express = require('express');
var cookieParser = require('cookie-parser');
var session =  require('express-session');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var SHA256 = require("crypto-js/sha256");
var crypto = require('crypto');


/***************************initialisation***************************/
/********************************************************************/

var con = mysql.createConnection({
    host: "localhost",
    database: "********",
    user: "********",
    password: "********"
});

var app = express();

app.use('/static',express.static('public'));

app.use(cookieParser());
app.use(session({secret: "Shh, its a secret!"}));

var uniq = function(a) {
    return a.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    })
}

var reg_email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

var genuuid = function(callback) {
    if (typeof(callback) !== 'function') {
        return uuidFromBytes(crypto.randomBytes(16));

    }

    crypto.randomBytes(16, function(err, rnd) {
        if (err) return callback(err);
        callback(null, uuidFromBytes(rnd));

    });

}

function uuidFromBytes(rnd) {
    rnd[6] = (rnd[6] & 0x0f) | 0x40;
    rnd[8] = (rnd[8] & 0x3f) | 0x80;
    rnd = rnd.toString('hex').match(/(.{8})(.{4})(.{4})(.{4})(.{12})/);
    rnd.shift();
    return rnd.join('-');

}

var erreur= new Object;
erreur.inscr = null;
erreur.ajout = null;
erreur.connexion = null;

app.set('trust proxy', 1);


app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));


app.use(function (req, res, next) {
    if (req.session.grp==null) {
        req.session.grp = 0;
        req.session.user_id = 0;
        req.session.login = null;
    }
    next();
})


app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});




///////////////////////////////////////////////////////////////////////////////
/***************************************APP***********************************/
///////////////////////////////////////////////////////////////////////////////




app.get('/', function(req,res){
    erreur.inscr=null;
    erreur.connexion=null;
    erreur.ajout=null;
    afficher_home(req, res);
});


/***************************DECONNEXION******************************/
/********************************************************************/


app.get('/deconnexion', function(req, res, next){
    erreur.inscr=null;
    erreur.connexion=null;
    erreur.ajout=null;
    afficher_home(req, res);
}
).post('/deconnexion', function(req, res, next){
    console.log("deconnexion");
    if(req.session.grp>0)
    {
        req.session.grp=0;
        req.session.user_id=0;
        req.session.login=null;
    }
    afficher_home(req, res);
});


/*****************************INSCRIPTION***************************/
/*******************************************************************/


app.get('/inscription', function(req, res, next){
    erreur.inscr=null;
    erreur.connexion=null;
    erreur.ajout=null;
    afficher_home(req, res);
}).post('/inscription', function(req, res, next){
    console.log("inscription");
    var args = {
        login: req.body.login,
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
        mdp: req.body.mdp,
        adresse: req.body.adresse
    }
    con.query("SELECT login, email FROM utilisateur WHERE upper(login) LIKE upper('"
        + args.login +"') OR upper(email) LIKE upper('" + args.email +"');",
        function(err,result,fields){
            if (err) return;
            var login_email_chk = (result.length == 0);
            if(!login_email_chk)
            {
                erreur.inscr = "login";
                console.log("erreur login");
                return;
            }
            var email_chk = reg_email.test(args.email) && (args.email.length < 50);
            if(!email_chk)
            {
                erreur.inscr = "email";
                console.log("erreur email");
                return;
            }
            var nom_chk = (args.nom.length < 50);
            var prenom_chk = (args.prenom.length < 50);
            var mdp_chk = (args.mdp.length > 7);
            if(!mdp_chk)
            {
                erreur.inscr = "mdp";
                console.log("erreur mot de passe");
                return;
            }
            var adresse_chk = (args.adresse.length < 200);

            var mdp_sha256 = SHA256(args.mdp);
            var mdp_crypto = ""+mdp_sha256.words[0]+mdp_sha256.words[1]+mdp_sha256.words[2]+mdp_sha256.words[3];
            console.log(mdp_crypto);

            var chk = login_email_chk && email_chk && nom_chk && prenom_chk && mdp_chk && adresse_chk;
            if(chk==true)
            {
                con.query("INSERT INTO utilisateur (login,nom,prenom,email,adresse,mdp) VALUES (upper('"
                    + args.login + "'),upper('" + args.nom + "'),upper('" + args.prenom + "'),upper('"
                    + args.email + "'),upper('" + args.adresse + "'),'" + mdp_crypto + "');");
                console.log(args.login);
                erreur.inscr = "réussi";
                console.log("utilisateur ajouté :");
            }
            else
            {
                erreur.inscr = "impossible";
                console.log("ajout impossible !");
            }
        });
    afficher_home(req, res);
    erreur.inscr=null;
});


/********************SUPPRESSION UTILISATEUR************************/
/*******************************************************************/


app.get('/suppression_u', function(req, res, next){
    erreur.inscr=null;
    erreur.connexion=null;
    erreur.ajout=null;
    afficher_home(req, res);
}).post('/suppression_u', function(req, res, next){
    if(req.session.grp==2 && req.session.user_id!=req.body.id)
    {
        con.query("DELETE FROM utilisateur WHERE id = " + req.body.id + ";",
            function(err,result,fields){
                if(err) return;
                else
                    console.log('suppression ok');
            });
    }
    else
    {
        console.log("suppression non authorisé!");
    }
    afficher_home(req, res);
});


/***********************AJOUT UTILISATEUR***************************/
/*******************************************************************/


app.get('/ajout_u', function(req, res, next){
    erreur.inscr=null;
    erreur.connexion=null;
    erreur.ajout=null;
    afficher_home(req, res);
}).post('/ajout_u', function(req, res, next){
    var args = {
        groupe: req.body.groupe,
        login: req.body.login,
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
        mdp: req.body.mdp,
        adresse: req.body.adresse
    }
    con.query("SELECT login, email FROM utilisateur WHERE upper(login) LIKE upper('"
        + args.login +"') OR upper(email) LIKE upper('" + args.email +"');",
        function(err,result,fields){
            if (err) return;
            var login_email_chk = (result.length == 0);
            if(!login_email_chk)
            {
                erreur.ajout = "login";
                console.log("erreur login");
                return;
            }
            var email_chk = reg_email.test(args.email) && (args.email.length < 50);
            if(!email_chk)
            {
                erreur.ajout = "email";
                console.log("erreur email");
                return;
            }
            var nom_chk = (args.nom.length < 50);
            var prenom_chk = (args.prenom.length < 50);
            var mdp_chk = (args.mdp.length > 7);
            if(!mdp_chk)
            {
                erreur.ajout = "mdp";
                console.log("erreur mot de passe");
                return;
            }
            var adresse_chk = (args.adresse.length < 200);

            var mdp_sha256 = SHA256(args.mdp);
            var mdp_crypto = ""+mdp_sha256.words[0]+mdp_sha256.words[1]+mdp_sha256.words[2]+mdp_sha256.words[3];
            console.log(mdp_crypto);

            var chk = login_email_chk && email_chk && nom_chk && prenom_chk && mdp_chk && adresse_chk;
            if(chk==true)
            {
                con.query("INSERT INTO utilisateur (login,nom,prenom,email,adresse,mdp,grp) VALUES (upper('"
                    + args.login + "'),upper('" + args.nom + "'),upper('" + args.prenom + "'),upper('"
                    + args.email + "'),upper('" + args.adresse + "'),'" + mdp_crypto + "','" + args.groupe + "');");
                console.log(args.login);
                erreur.ajout = "réussi";
                console.log("utilisateur ajouté :");
            }
            else
            {
                erreur.ajout = "impossible";
                console.log("ajout impossible !");
            }
        });
    afficher_home(req, res);
    erreur.ajout=null;
});


/*****************************CONNEXION******************************/
/********************************************************************/


app.get('/connexion', function(req, res, next){
    erreur.inscr=null;
    erreur.connexion=null;
    erreur.ajout=null;
    afficher_home(req, res);
}).post('/connexion', function(req, res, next){
    con.query("SELECT id, login, mdp, grp FROM utilisateur WHERE upper(login) LIKE upper('"
        + req.body.login + "');",
        function(err,result,fields){
            if(result.length>0)
            {
                console.log('entree');
                console.log(result[0].mdp);

                var mdp_sha256 = SHA256(req.body.mdp);
                var mdp_crypto = ""+mdp_sha256.words[0]+mdp_sha256.words[1]+mdp_sha256.words[2]+mdp_sha256.words[3];
                console.log(mdp_crypto);

                if(mdp_crypto == result[0].mdp)
                {
                req.session.grp = result[0].grp;
                req.session.user_id = result[0].id;
                req.session.login = result[0].login;
                }
                else
                {
                    console.log("connexion impossible!");
                    erreur.connexion = "mdp";
                }
            }
            else
            {
                console.log("connexion impossible");
                erreur.connexion = "login";
            }
        })
    afficher_home(req, res);
    erreur.connexion = null;
});


/***********************CREER RECETTE*******************************/
/*******************************************************************/


app.get('/creer_recette', function(req, res, next){
    erreur.inscr=null;
    erreur.connexion=null;
    erreur.ajout=null;
    afficher_home(req, res);
}).post('/creer_recette', function(req, res, next){
    var args = {
        nom: req.body.nom,
        descr: req.body.descr,
        diff: req.body.diff,
        prix: req.body.prix,
        nb_pers: req.body.nb_pers,
        nrj: req.body.nrj,
        tmp: req.body.tmp
    }
    var nom_chk = (args.nom.length < 50);
    var descr_chk = (args.descr.length < 200);
    var nb_pers_chk = (args.nb_pers > 0);
    var nrj_chk = (args.nrj > 0);
    var tmp_chk = (args.tmp > 0 );

    var chk = nom_chk && descr_chk && nb_pers_chk && nrj_chk && tmp_chk;
    if(chk==true)
    {
        con.query("INSERT INTO recette (nom,createur,description,difficulte,prix,nb_personnes,energie,temps_preparation) VALUES (upper('"
            + args.nom + "')," + req.session.user_id + ",upper('" + args.descr + "'),upper('"
            + args.diff + "')," + args.prix + "," + args.nb_pers + "," + args.nrj + "," + args.tmp + ");",
            function(err, result, fields){
                if(err) return;
            });
    }
    else
    {
        console.log("ajout impossible !");
    }
    afficher_home(req, res);
});


/***********************CREER INGREDIENT*******************************/
/*******************************************************************/


app.get('/creer_ingredient/:id_recette', function(req, res, next){
    afficher_recette(req, res);
}).post('/creer_ingredient/:id_recette', function(req, res, next){
    var args = {
        nom: req.body.nom,
        energie: req.body.energie,
    }
    var nom_chk = (args.nom.length < 50);
    var energie_chk = (args.energie >= 0);

    var chk = nom_chk && energie_chk;
    if(chk==true)
    {
        con.query("INSERT INTO ingredient (nom,createur,energie) VALUES (upper('"
            + args.nom + "')," + req.session.user_id + "," + args.energie + ");");
    }
    else
    {
        console.log("ajout impossible !");
    }
    afficher_recette(req, res);
});


/********************SUPPRESSION INGREDIENT*************************/
/*******************************************************************/


app.get('/suppression_i', function(req, res, next){
    erreur.inscr=null;
    erreur.connexion=null;
    erreur.ajout=null;
    afficher_home(req, res);
}).post('/suppression_i', function(req, res, next){
    if(req.session.grp==2)
    {
        con.query("DELETE FROM ingredient WHERE id = " + req.body.ingr_id + ";",
            function(err,result,fields){
                if(err)
                {
                    console.log("suppr impossible");
                    throw err;
                }
                console.log('suppression ok');
            });
    }
    else
    {
        console.log("suppression non authorisé!");
    }
    afficher_home(req, res);
});


/******************************HOME**********************************/
/********************************************************************/

function afficher_home(req, res){
    con.query("SELECT login, id FROM utilisateur where id != " + req.session.user_id + ";",
        function (err, result, fields) {
            if (err) return;
            var utilisateur = [];
            var i=0;
            result.forEach(function(res){
                var tmp ={
                    login: res.login,
                    id: res.id,
                }
                utilisateur[i]=tmp;
                i++;
            });
            con.query("SELECT r.nom as r_nom, r.id as r_id FROM recette r WHERE r.createur = " + req.session.user_id + ";",
                function (err, result, fields) {
                    if (err) return;
                    var recette = [];
                    var i=0;
                    result.forEach(function(res){
                        var tmp ={
                            nom: res.r_nom,
                            id: res.r_id,
                        }
                        recette[i]=tmp;
                        i++;
                    });
                    con.query("SELECT distinct p.id, r.nom , p.date_p, p.nb_personnes FROM planning p JOIN recette r ON r.id = p.recette WHERE p.utilisateur = " + req.session.user_id + " ORDER BY p.date_p;",
                        function (err, result, fields) {
                            if (err) return;
                            var plannings = [];
                            var i=0;
                            result.forEach(function(res){
                                var tmp ={
                                    recette: res.nom,
                                    date: res.date_p,
                                    nb_pers: res.nb_personnes,
                                    id: res.id
                                }
                                plannings[i]=tmp;
                                i++;
                            });
                            con.query("SELECT id, nom FROM ingredient;",
                                function (err, result, fields) {
                                    if (err) return;
                                    if(result==null || result.length==0)
                                    {
                                        ingredients=null;
                                    }
                                    else
                                    {
                                        var ingredients= [];
                                        var i=0;
                                        result.forEach(function(res){
                                            var tmp ={
                                                nom: res.nom,
                                                id: res.id
                                            }
                                            ingredients[i]=tmp;
                                            i++;
                                        });
                                    }
                                    res.render('home.ejs', {
                                        recettes: recette,
                                        utilisateurs: utilisateur,
                                        connexion: req.session.grp,
                                        login: req.session.login,
                                        plannings: plannings,
                                        ingredients: ingredients,
                                        erreur: erreur
                                    });
                                });
                        });
                });
        });
};

app.get('/home', function(req, res, next){
    erreur.inscr=null;
    erreur.connexion=null;
    erreur.ajout=null;
    afficher_home(req, res);
});


/***************************LISTE RECETTES***************************/
/********************************************************************/


function afficher_liste_recette(req,res)
{
    con.query("SELECT r.nom as r_nom, r.id as r_id FROM recette r;",
        function (err, result, fields) {
            if (err) return;
            var recette = [];
            var i=0;
            result.forEach(function(res){
                var tmp ={
                    nom: res.r_nom,
                    id: res.r_id,
                }
                recette[i]=tmp;
                i++;
            });
            res.render('liste_recettes.ejs', {
                recettes: recette,
                connexion: req.session.grp,
                login: req.session.login
            });
        });
};


app.get('/recette', function(req,res){
    afficher_liste_recette(req,res);
}
).post('/recette', function (req, res) {
    con.query("SELECT distinct r.nom as r_nom, r.id as r_id FROM recette r LEFT JOIN composition c ON c.recette = r.id LEFT JOIN ingredient i ON c.ingredient = i.id WHERE upper(i.nom) LIKE '%" + req.body.ingr + "%';",
        function (err, result, fields) {
            if (err) return;
            var recette = [];
            var i=0;
            result.forEach(function(res){
                var tmp ={
                    nom: res.r_nom,
                    id: res.r_id,
                }
                recette[i]=tmp;
                i++;
            });
            res.render('liste_recettes.ejs', {
                recettes: recette,
                connexion: req.session.grp,
                login: req.session.login
            });
        });
});


/********************SUPPRESSION RECETTE****************************/
/*******************************************************************/


app.get('/supprimer_recette', function(req, res, next){
    erreur.inscr=null;
    erreur.connexion=null;
    erreur.ajout=null;
    afficher_home(req, res);
}).post('/supprimer_recette', function(req, res, next){
    con.query("DELETE FROM composition WHERE recette = " + req.body.id + ";",
        function(err,result,fields){
            if(err)
            {
                console.log("err suppr compo");
                return;
            }
            con.query("DELETE FROM etape WHERE recette = " + req.body.id + ";",
                function(err,result,fields){
                    if(err)
                    {
                        console.log("err suppr etape")
                        return;
                    }
                    con.query("DELETE FROM planning WHERE recette = " + req.body.id + ";",
                        function(err,result,fields){
                            if(err)
                            {
                                console.log("err suppr planning")
                                return;
                            }
                            con.query("DELETE FROM recette WHERE id = " + req.body.id + ";",
                                function(err,result,fields){
                                    if(err)
                                    {
                                        console.log("err suppr recette");
                                        throw err;
                                    }
                                    else
                                        console.log('suppression ok');
                                });
                        });
                });
        });
    afficher_home(req, res);
});


/********************SUPPRESSION COMPOSITION************************/
/*******************************************************************/


app.get('/supprimer_compo/:id_recette', function(req, res, next){
    afficher_recette(req, res);
}).post('/supprimer_compo/:id_recette', function(req, res, next){
    con.query("DELETE FROM composition WHERE id = " + req.body.id + ";",
        function(err,result,fields){
            if(err) return;
            else
                console.log('suppression ok');
        });
    afficher_recette(req, res);
});


/********************SUPPRESSION ETAPE******************************/
/*******************************************************************/


app.get('/supprimer_etape/:id_recette', function(req, res, next){
    afficher_recette(req, res);
}).post('/supprimer_etape/:id_recette', function(req, res, next){
    con.query("DELETE FROM etape WHERE id = " + req.body.id + ";",
        function(err,result,fields){
            if(err) return;
            else
                console.log('suppression ok');
        });
    afficher_recette(req, res);
});


/************************AJOUTER ETAPE******************************/
/*******************************************************************/


app.get('/ajouter_etape/:id_recette', function(req, res, next){
    afficher_recette(req, res);
}).post('/ajouter_etape/:id_recette', function(req, res, next){
    var args = {
        recette: req.body.recette,
        descr: req.body.descr,
        duree: req.body.duree,
    }
    var descr_chk = (args.descr.length < 50);
    var duree_chk = (args.duree > 0 );

    var chk = descr_chk && duree_chk;
    if(chk==true)
    {
        con.query("SELECT MAX(numero) as max_num FROM etape e WHERE e.recette = " + args.recette + ";",function(err,result,fields){
            if (err) return;
            if(result==null || result[0].max_num==null)
                var max_num = 0;
            else
                var max_num = result[0].max_num;
            var new_num = max_num+1;
            con.query("INSERT INTO etape (recette,numero,description,duree) VALUES ("
                + args.recette + "," + new_num + ",upper('" + args.descr + "')," + args.duree + ");");
        });
    }
    else
    {
        console.log("ajout impossible !");
    }
    afficher_recette(req, res);
});


/************************AJOUTER COMPO******************************/
/*******************************************************************/


app.get('/ajouter_compo/:id_recette', function(req, res, next){
    afficher_recette(req, res);
}).post('/ajouter_compo/:id_recette', function(req, res, next){
    var args = {
        recette: req.body.recette,
        ingr: req.body.ingr,
        quantite: req.body.quantite,
    }
    var chk = (args.quantite > 0 );
    if(chk==true)
    {
        con.query("INSERT INTO composition (recette,ingredient,quantite) VALUES ("
            + args.recette + "," + args.ingr + "," + args.quantite + ");");
    }
    else
    {
        console.log("ajout impossible !");
    }
    afficher_recette(req, res);
});


/************************AJOUTER PLANNING***************************/
/*******************************************************************/


app.get('/ajouter_planning', function(req, res, next){
    afficher_home(req, res);
}).post('/ajouter_planning', function(req, res, next){
    var args = {
        recette: req.body.recette,
        nb_pers: req.body.nb_pers,
        date: req.body.date
    }
    var nb_pers_chk = (args.nb_pers > 0);
    var date_chk = (args.date > 0 );

    var chk = nb_pers_chk && date_chk;
    if(chk==true)
    {
        con.query("INSERT INTO planning (recette,utilisateur,nb_personnes,date_p) VALUES ("
            + args.recette + "," + req.session.user_id + "," + args.nb_pers + ", curdate()+" +args.date + ");");
    }
    else
    {
        console.log("ajout impossible !");
    }
    afficher_home(req, res);
});


/********************SUPPRESSION PLANNING***************************/
/*******************************************************************/


app.get('/suppression_p', function(req, res, next){
    erreur.inscr=null;
    erreur.connexion=null;
    erreur.ajout=null;
    afficher_home(req, res);
}).post('/suppression_p', function(req, res, next){
    if(req.session.grp==2)
    {
        con.query("DELETE FROM planning WHERE id = " + req.body.id + ";",
            function(err,result,fields){
                if(err) return;
                else
                    console.log('suppression ok');
            });
    }
    else
    {
        console.log("suppression non authorisé!");
    }
    afficher_home(req, res);
});



/************************AFFICHAGE RECETTE*****************************/
/**********************************************************************/


function afficher_recette(req,res){
    con.query("SELECT r.createur as owner_id, r.nom as r_nom, r.id as r_id, r.nb_personnes as r_nb, r.temps_preparation as r_tmp,\
        i.nom as ingr_nom, i.id as ingr_id, lower(u.login) as utilisateur\
        FROM recette r\
        LEFT JOIN composition c ON r.id = c.recette\
        LEFT JOIN ingredient i ON c.ingredient = i.id\
        LEFT JOIN utilisateur u ON r.createur = u.id\
        WHERE r.id = " + req.params.id_recette + ";",
        function (err, result, fields) {
            if (err) return;
            if(result==null || result.length==0)
            {
                afficher_liste_recette(req,res);
                return;
            }
            var recette = {
                nom_recette: result[0].r_nom,
                id_recette: result[0].r_id,
                nb_personnes: result[0].r_nb,
                duration: result[0].r_tmp,
                createur: result[0].utilisateur
            };
            console.log(recette.id_recette);
            con.query("SELECT lower(i.nom) as ingr_nom, c.id as compo_id, c.quantite as ingr_quantite FROM recette r LEFT JOIN composition c ON r.id = c.recette"
                + " LEFT JOIN ingredient i ON i.id = c.ingredient WHERE r.id = " + req.params.id_recette + ";",
                function(err2, result2, fields2){
                    if (err) return;
                    var ingredients_recette=[];
                    result2.forEach(function(res){
                        var tmp = new Object();
                        tmp.nom=res.ingr_nom;
                        tmp.compo_id=res.compo_id;
                        tmp.quantite=res.ingr_quantite;
                        ingredients_recette.push(tmp);
                    });
                    if(ingredients_recette[0].nom==null)
                        ingredients_recette=[];
                    else
                        ingredients_recette = uniq(ingredients_recette);
                    con.query("SELECT lower(e.description) as descr, e.id as etape_id, e.duree as duree_etape FROM recette r LEFT JOIN etape e ON r.id = e.recette"
                        + " WHERE r.id = " + req.params.id_recette + " ORDER BY e.numero ASC;",
                        function(err1, result1, fields1){
                            if (err) return;
                            var etapes=[];
                            for(i=0;i<result1.length;i++){
                                var tmp = new Object();
                                tmp.descr=result1[i].descr;
                                tmp.id=result1[i].etape_id;
                                tmp.duree=result1[i].duree_etape;
                                etapes.push(tmp);
                            };
                            if(etapes[0].descr==null)
                                etapes=[];
                            if(result[0].owner_id==req.session.user_id){
                                var proprietaire=true;
                            }
                            else
                            {
                                var proprietaire=false;
                            }
                            con.query("SELECT id, nom from ingredient;",function(err2,result2,fields2){
                                if (err) return;
                                var ingredients_total=[];
                                if(result2==null || result2.length==0)
                                {
                                    ingredients_total=[];
                                }
                                else
                                {
                                    result2.forEach(function(res){
                                        var tmp = new Object();
                                        tmp.nom=res.nom;
                                        tmp.id=res.id;
                                        ingredients_total.push(tmp);
                                    });
                                    if(ingredients_total[0].nom==null)
                                        ingredients_total=[];
                                    else
                                        ingredients_total = uniq(ingredients_total);
                                }
                                res.render('recette.ejs', {
                                    nom_recette: recette.nom_recette,
                                    id_recette: recette.id_recette,
                                    duration: recette.duration,
                                    nb_personnes: recette.nb_personnes,
                                    createur: recette.createur,
                                    ingredients_recette: ingredients_recette,
                                    ingredients_total: ingredients_total,
                                    etapes: etapes,
                                    connexion: req.session.grp,
                                    login: req.session.login,
                                    proprietaire: proprietaire
                                });
                            });
                        });
                });
        });
};


app.get('/recette/:id_recette', function(req,res){
    afficher_recette(req, res, erreur);
});


/******************************404 ERROR*****************************/
/********************************************************************/


app.use(function(req, res, next){
    afficher_home(req, res);
});

app.listen(8888);
