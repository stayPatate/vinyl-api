## Reponses aux questions

# 1_PUT & PATCH

PUT remplace entièrement une ressource
Tous les champs doivent être envoyés

PATCH modifie partiellement une ressource
On envoie uniquement les champs à mettre à jour

# 2_FETCH / AXIOS

Si une requête fonctionne dans Postman mais pas dans Firefox, c’est généralement un problème de CORS
Les navigateurs bloquent les requêtes entre origines différentes (ex: frontend sur 5173 et API sur 3000)
Postman ne bloque pas ces requêtes

Solution : activer le middleware CORS dans l’API

# 3_NGINX / APACHE

On utilise Nginx ou Apache en complément de Node pour :
- Reverse proxy
- Gestion HTTPS
- Meilleures performances
- Sécurité
- Load balancing

En production, on n’expose pas directement le serveur Node

# 4_Performances (3 axes)

- Indexation de la base de données
- Pagination des résultats
- Mise en cache (HTTP ou Redis)