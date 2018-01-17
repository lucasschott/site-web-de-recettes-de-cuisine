function affichage_creer_ingredient(){
    if(document.querySelector('.creer_ingredient').style.display == 'none')
    {
        document.querySelector('.creer_ingredient').style.display = 'block';
    }
    else
    {
        document.querySelector('.creer_ingredient').style.display = 'none';
    }
}
