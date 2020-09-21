const axios = require('axios');
const { request } = require('express');




module.exports = {
    ApiLogin : async function(email, password ){
        return axios.post('https://barack-quizz.herokuapp.com/login',{
            email: email,
            password: password
          }).then(response => {
            console.log(response.data)
            return response.data
        })
        .catch(error => {
            console.log("ERREUR : "+error)
        });
    },

    ApiProfil : async function(authorization){
        return axios.get('https://barack-quizz.herokuapp.com/users/profile',{
            headers: {
                Authorization: authorization
              }
            
          }).then(response => {
            console.log(response.data)
            return response.data
        })
        .catch(error => {
            console.log(error)
        });
    },

    ApiListeQuizz : async function(authorization){
        return axios.get('https://barack-quizz.herokuapp.com/Quizz/MyQuizz',{
            headers: {
                Authorization: authorization
              }
            
          }).then(response => {
            console.log(response.data)
            return response.data
        })
        .catch(error => {
            console.log(error)
        });
    },

    ApiNewUser : async function(nom, prenom, email, password, username){
        return axios.post('https://barack-quizz.herokuapp.com/users/createUser',{
            nom: nom,
            prenom: prenom,
            email: email,
            password: password,
            username: username,
          }).then(response => {
            console.log(response.data)
            return response.data
        })
        .catch(error => {
            console.log(error)
        });
    },

    ApiListeQuestion : async function(authorization, id){
        return axios.get('https://barack-quizz.herokuapp.com/DetailQuizz/listeQuestion/' + id,{
            headers: {
                Authorization: authorization
              }
          }).then(response => {
            console.log(response.data)
            return response.data
        })
        .catch(error => {
            console.log(error)
        });
    },

    ApiNewQuestion : async function(id,authorization, question, time, point, premierChoix, deuxiemeChoix, troisiemeChoix, quatriemeChoix, reponse){
        const data = {
            question: question,
            time: time,
            point: point,
            premierChoix: premierChoix,
            deuxiemeChoix: deuxiemeChoix,
            troisiemeChoix: troisiemeChoix,
            quatriemeChoix: quatriemeChoix,
            reponse: reponse
        }

        const option ={
            headers:{
                Authorization: authorization
            }
        }
        return axios.post('https://barack-quizz.herokuapp.com/DetailQuizz/nouvelleQuestion/'+id,data,option).then(response => {
            console.log(response.data)
            return response.data
        })
        .catch(error => {
            console.log(error)
        });
    },

    ApiNewQuizz : async function(authorization,titre){
        const data = {
            titre: titre,
        }

        const option ={
            headers:{
                Authorization: authorization
            }
        }
        return axios.post('https://barack-quizz.herokuapp.com/Quizz/NewQuizz',data,option).then(response => {
            console.log(response.data)
            return response.data
        })
        .catch(error => {
            console.log(error)
        });
    },

    ApiQuestionDetail : async function(authorization, id){
        return axios.get('https://barack-quizz.herokuapp.com/DetailQuizz/question/' + id,{
            headers: {
                Authorization: authorization
              }
          }).then(response => {
            console.log(response.data)
            return response.data
        })
        .catch(error => {
            console.log(error)
        });
    },

    ApiModifQuestion : async function(id, authorization, question, time, point, premierChoix, deuxiemeChoix, troisiemeChoix, quatriemeChoix, reponse){
        const data = {
            question: question,
            time: time,
            point: point,
            premierChoix: premierChoix,
            deuxiemeChoix: deuxiemeChoix,
            troisiemeChoix: troisiemeChoix,
            quatriemeChoix: quatriemeChoix,
            reponse: reponse
        }

        const option ={
            headers:{
                Authorization: authorization
            }
        }
        return axios.put('https://barack-quizz.herokuapp.com/DetailQuizz/nouvelleQuestionModif/'+id,data,option).then(response => {
            console.log(response.data)
            return response.data
        })
        .catch(error => {
            console.log(error)
        });
    },

    ApiLinkQuizz : async function(id,authorization){
        const data = {
            numberRoom: 10,
        }
        const option ={
            headers:{
                Authorization: authorization
            }
        }

        return axios.post('https://barack-quizz.herokuapp.com/LanceQuizz/NewLien/'+id,data,option).then(response => {
            console.log(response.data)
            return response.data
        })
        .catch(error => {
            console.log(error)
        });
    },

    ApiMyRoom : async function(authorization, id){
        return axios.get('https://barack-quizz.herokuapp.com/LanceQuizz/MyRoom/' + id,{
            headers: {
                Authorization: authorization
              }
          }).then(response => {
            console.log(response.data)
            return response.data
        })
        .catch(error => {
            console.log(error)
        });
    },

    ApiListeRoom : async function(){
        return axios.get('https://barack-quizz.herokuapp.com/LanceQuizz/ListeRoom').then(response => {
            return response.data
        })
        .catch(error => {
            console.log(error)
        });
    },

    ApiLanceQuizz : async function(id, room, authorization){

        const option ={
            headers:{
                Authorization: authorization
            }
        }

        return axios.get('https://barack-quizz.herokuapp.com/LanceQuizz/Quizz/'+id+'/'+room,option).then(response => {
            return response.data
        })
        .catch(error => {
            console.log(error)
        });
    },

    ApiMyLink : async function(myLink, authorization){
        return axios.get('https://barack-quizz.herokuapp.com/LanceQuizz/MyLink/'+myLink,{
            headers: {
                Authorization: authorization
              }
            
          }).then(response => {
            return response.data
        })
        .catch(error => {
            console.log(error)
        });
    },

    ApiMyScore : async function(authorization){
        return axios.get('https://barack-quizz.herokuapp.com/Score/MyScore',{
            headers: {
                Authorization: authorization
              }
            
          }).then(response => {
            return response.data
        })
        .catch(error => {
            console.log(error)
        });
    },

    ApiReponseQuizz : async function(id,authorization,reponseQuizz){
        console.log(reponseQuizz)
        var data =   {"reponseQuizz":reponseQuizz};
        console.log(data)
        var config = {
            method: 'post',
            url: 'https://barack-quizz.herokuapp.com/LanceQuizz/validQuestiontest/'+id,
            headers: { 
                'Authorization': authorization, 
            },
            data : data
        };

        return axios(config).then(function (response) {
            console.log("test dans api")
            console.log(response.data);
            return response.data
        }).catch(function (error) {
            //console.log(error);
        });
    },


}