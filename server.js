let express = require('express')
let app = express()
var bodyParser = require('body-parser')
let apiQuizz = require('./api/ApiQuizz')
const session = require ( 'express-session' )
var PORT = process.env.PORT || 8000
//Parametre de l'application
const http = require('http')
const server = http.createServer(app)
const socketio = require('socket.io')
const io = socketio(server)

//Port sur lequel sera lancer l'appli
server.listen(PORT, () =>{
   console.log('listening on *:8000');
})

app.use(bodyParser.urlencoded({ extended: true }));

//session nodejs
// Session Setup 
app.use(session({ 
   // It holds the secret key for session 
   secret: 'Your_Secret_Key', 
   // Forces the session to be saved 
   // back to the session store 
   resave: false, 
   // Forces a session that is "uninitialized" 
   // to be saved to the store 
   saveUninitialized: false,
}));


//Moteur de template ejs
app.set('view engine', 'ejs')
//Lien pour le dossier public 
app.use('/assets',express.static('public'))

app.use(bodyParser.json());   
//Route
app.get('/', (request, response) =>{
   response.render('index')
})

//--------------------------------------------------------- Affichage page home, login, page enregistrement-------------------------------------------//
//Affichage de la page home avec la liste des quizz
app.get('/home', async (request, response) =>{
   if(request.session.token === undefined){
      response.redirect('/')
   }else{
      console.log("LA PAGE HOME ======"+request.session.PrenomNom)
      const listeQuizz = await apiQuizz.ApiListeQuizz(request.session.token).then(data =>{response.render('home', {data: data, nomPrenom: request.session.PrenomNom})}).catch(error =>{ response.redirect('/'); console.log(error) })
   }
})

//Methode post de la page login
app.post('/', async (request, response) =>{
   var email = request.body.email
   var password = request.body.password
   const redirect = await apiQuizz.ApiLogin(email,password).then(data => {
      request.session.token = data.Authorization
      apiQuizz.ApiProfil(request.session.token).then(data =>{
         request.session.PrenomNom = data.nom
         response.redirect('/home')
         //console.log("Le nom est prenon est : "+request.session.PrenomNom)
      }).catch(error =>{ console.log(error) })

     
      return data 
   }).catch(error =>{ response.redirect('/'); console.log(error) })
   

})

//Affichage de la page d'inscription
app.get('/signup', (request, response) =>{
   response.render('signup')
})

//methode post de la page d'inscription
app.post('/signup_post', async (request, response) =>{
   var nom = request.body.nom
   var prenom = request.body.prenom
   var username = request.body.username
   var email = request.body.email
   var password = request.body.password
   const redirect = await apiQuizz.ApiNewUser(nom,prenom,email,password,username).then(data => {
      response.redirect('/')
      return data 
   }).catch(error =>{ response.redirect('/signup'); console.log(error) })
})

//--------------------------------------------------------- Affichage question et quizz, lien quizz-------------------------------------------//

//Affichage de la liste des question d'un quizz
app.get('/question/:id', async (request, response) =>{

   if(request.session.token === undefined){
      response.redirect('/')
   }else{
      var id = request.params.id
      var myLink = ""
      var room = ""
      const myRoom = await apiQuizz.ApiMyRoom(request.session.token, id).then(data =>{myLink = data.numberRoom, room = data.numberRoom}).catch(error =>{ console.log(error) })
      const ListeQuestion = await apiQuizz.ApiListeQuestion(request.session.token, id).then(data =>{
         response.render('question', {data: data, id:id, myLink: myLink, nomPrenom: request.session.PrenomNom, room: room})
      }).catch(error =>{ response.redirect('/'); console.log(error) })  
   }

})

//Affichage du detail de la question pour la modifier
app.get('/AfficheQuestion/:id', async (request, response) =>{
   if(request.session.token === undefined){
      response.redirect('/')
   }else{
      var id = request.params.id
      console.log(id)
      
      const afficheQuestion = await apiQuizz.ApiQuestionDetail(request.session.token, id).then(data =>{response.render('afficheQuestion', {data: data, id:id, nomPrenom: request.session.PrenomNom})}).catch(error =>{ response.redirect('/'); console.log(error) })
   }
})

//Affichage du formulaire pour une nouvelle question
app.get('/newQuestion/:id', async (request, response) =>{
  
   if(request.session.token === undefined){
      response.redirect('/')
   }else{
      var id = request.params.id
      //console.log(id)
      response.render('newQuestion',{id:id, nomPrenom: request.session.PrenomNom}) 
   }
  
})

//Affichage du formulaire pour un nouveau quizz
app.get('/newQuizz', async (request, response) =>{
  
   if(request.session.token === undefined){
      response.redirect('/')
   }else{
      response.render('newQuizz', {nomPrenom: request.session.PrenomNom})  
   }

})

//Methode post pour la modification d'une question
app.post('/modifquestion/:id', async (request, response) =>{
   var id = request.params.id
   var question = request.body.question
   var time = request.body.time
   var point = request.body.point
   var premierChoix = request.body.premierChoix
   var deuxiemeChoix = request.body.deuxiemeChoix
   var troisiemeChoix = request.body.troisiemeChoix
   var quatriemeChoix = request.body.quatriemeChoix
   var reponse = request.body.reponse

   if(request.session.token === undefined){
      response.redirect('/')
   }else{
      const newQuestion = await apiQuizz.ApiModifQuestion(id,request.session.token,question,time,point,premierChoix,deuxiemeChoix,troisiemeChoix,quatriemeChoix,reponse).then(data => {
         response.redirect('/question/'+data.quizz.id)
         return data 
      }).catch(error =>{ response.redirect('/home'); console.log(error) }) 
   }
   
})

//Methode post pour la creation d'un lien du quizz
app.post('/linkquizz/:id', async (request, response) =>{
   var id = request.params.id

   if(request.session.token === undefined){
      response.redirect('/')
   }else{
      const newQuestion = await apiQuizz.ApiLinkQuizz(id,request.session.token).then(data => {
         response.redirect('/question/'+id)
         return data 
      }).catch(error =>{ response.redirect('/home'); console.log(error) })
   }
   
})


//Methode post pour créer un nouveau quizz
app.post('/newQuizzpost', async (request, response) =>{
  
   var titre = request.body.titre

   if(request.session.token === undefined){
      response.redirect('/')
   }else{
      const newQuestion = await apiQuizz.ApiNewQuizz(request.session.token,titre).then(data => {
         response.redirect('/home')
         return data 
      }).catch(error =>{ response.redirect('/home'); console.log(error) })
   }

})

//Methode pour creer une nouvelle question
app.post('/newQuestionpost/:id', async (request, response) =>{
  
   var id = request.params.id
   var question = request.body.question
   var time = request.body.time
   var point = request.body.point
   var premierChoix = request.body.premierChoix
   var deuxiemeChoix = request.body.deuxiemeChoix
   var troisiemeChoix = request.body.troisiemeChoix
   var quatriemeChoix = request.body.quatriemeChoix
   var reponse = request.body.reponse


   if(request.session.token === undefined){
      response.redirect('/')
   }else{
      const newQuestion = await apiQuizz.ApiNewQuestion(id,request.session.token,question,time,point,premierChoix,deuxiemeChoix,troisiemeChoix,quatriemeChoix,reponse).then(data => {
         response.redirect('/question/'+id)
         return data 
      }).catch(error =>{ response.redirect('/home'); console.log(error) })
   }
  
})

//--------------------------------------------------------- destruction session-------------------------------------------//

//Methode de destruction de la session lors de la deconnexion
app.get('/destroysession',function(request, response){
   sessionData = request.session;
   
   sessionData.destroy(function(err) {
       if(err){
           msg = 'Error destroying session';
           console.log("ERREUR ====== "+msg)
           response.json(msg);
       }else{
           msg = 'Session destroy successfully';
           console.log(msg)
           response.redirect('/')
       }
   });
});



//------------------------------------------------------------------------gestion du Quizz mutijoueur-------------------------------------//

//affiche la page de connexion pour joueur au quizz
app.get('/Quizz',function(request, response){
   // var id = request.params.id
   // var myRoom = request.params.myRoom
   response.render('Quizz',  {nomPrenom: request.session.PrenomNom})
});

//methode post pour la connexion au quizz
app.post('/post_redirectQuizz', async function(request, response){
   var numberRoom = request.body.numberRoom

   if(request.session.token === undefined){
      response.redirect('/')
   }else{
      const post_Redirect = await apiQuizz.ApiMyLink(numberRoom,request.session.token).then(data => {
         response.redirect(data.lien)
         //console.log(data.lien)
         return data 
      }).catch(error =>{ response.redirect('/home'); console.log(error) })
   }
   

});

//Start le quizz 
app.get('/StartQuizz/:id/:myRoom',async function(request, response){
   var id = request.params.id
   var myRoom = request.params.myRoom

   if(request.session.token === undefined){
      response.redirect('/')
   }else{
      const lanceQuizz = await apiQuizz.ApiLanceQuizz(id, myRoom, request.session.token).then(data => {
         response.render('startQuizz', {data: data, nomPrenom: request.session.PrenomNom})
         //console.log(data.lien)
         return data 
      }).catch(error =>{ response.redirect('/home'); console.log(error) })
   }
});

//affiche les score de l'utilisateur
app.get('/myScore',async function(request, response){

   if(request.session.token === undefined){
      response.redirect('/')
   }else{
      const myScore = await apiQuizz.ApiMyScore(request.session.token).then(data => {
         response.render('myScore', {data: data, nomPrenom: request.session.PrenomNom})
         //console.log("MES QUIZZZZ ==="+data.length)
         return data 
      }).catch(error =>{ response.redirect('/home'); console.log(error) })
   }
   

});

//affiche les resultat a un quizz
app.get('/result',async function(request, response){

   if(request.session.token === undefined){
      response.redirect('/')
   }else{
      response.render('result', {nomPrenom: request.session.PrenomNom})  
   }
});

//methode post pour verifier les question a un quizz
app.post('/reponseQuizz/:id', async function(request, response){
   var id = request.params.id
   var varreponseQuizz = request.body.allReponse


   if(request.session.token === undefined){
      response.redirect('/')
   }else{
      const ReponseQuizz = await apiQuizz.ApiReponseQuizz(id, request.session.token, JSON.parse(varreponseQuizz)).then(data => {
         //console.log("HEU "+data)
         response.render('result',{data: data, nomPrenom: request.session.PrenomNom})
         return data 
      }).catch(error =>{ response.redirect('/home'); })
   }
});


