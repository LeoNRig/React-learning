import { upload } from '@testing-library/user-event/dist/upload.js';
import firebase from 'firebase';
import { useEffect, useState } from 'react';
import {auth,storage,db} from './firebase.js';


function Header(props){
    const [progress, setProgress] = useState(0);

    const [file, setFile] = useState(null);

    useEffect(() => {
       
    }, [])


    function criarConta(e){
        e.preventDefault();
        let email = document.getElementById('email-cadastro').value;
        let username = document.getElementById('username-cadastro').value;
        let senha = document.getElementById('senha-cadastro').value;

        //Criar Conta Firebase

        auth.createUserWithEmailAndPassword(email, senha)
            .then((authUser)=>{
                authUser.user.updateProfile({
                    displayName : username
                })
                alert('Conta Criado com Sucesso!');
                let modal = document.querySelector('.ModalcriarConta');

                modal.style.display = "none";
            }).catch((error)=>{
                alert(error.message);
            })
            ;
    }
    function logar(e){
        e.preventDefault();

        let email = document.getElementById('email-login').value;
        let senha = document.getElementById('senha-login').value;

        auth.signInWithEmailAndPassword(email, senha)
        .then((auth)=>{
            props.setUser(auth.user.displayName);
            alert('Logado com Sucesso!');
            window.location.href ="/";
        }).catch((err)=>{
            alert(err.message);
        })
    }

    function AbrirModalConta(e){
        e.preventDefault();

        let modal = document.querySelector('.ModalcriarConta');

        modal.style.display ="block";

    }
    function abrirModalUpload(e){
        e.preventDefault();

        let modal = document.querySelector('.ModalUpload');

        modal.style.display ="block";

    }
    function fecharModalCriar(){
        let modal = document.querySelector('.ModalcriarConta');

        modal.style.display = "none";
    }

    function fecharModalUpload(){
        let modal = document.querySelector('.ModalUpload')
        modal.style.display = "none";
    }

    function deslogar(e){
        e.preventDefault();
        auth.signOut().then(function(val){
            props.setUser(null);
            window.location.href ="/";
        })
    }

    function uploadPost(e){
        e.preventDefault();
        let tituloPost = document.getElementById('titulo-upload').value;

        const uploadTask = storage.ref(`images/${file.name}`).put(file);

        uploadTask.on("storage_changed", function(snapshot){
            const progress = Math.round(snapshot.bytesTransferred/snapshot.totalBytes) * 100;
            setProgress(progress);
        },function (error){

        },function(){

            storage.ref("images").child(file.name).getDownloadURL()
            .then(function(url){
                db.collection('posts').add({
                    titulo: tituloPost,
                    image: url,
                    username:props.user,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                })

                setProgress(0);
                setFile(null);

                alert('Upload Realizado com Sucesso!!');

                document.getElementById('form-upload').reset();
                fecharModalUpload();
            })

        }
        )
    }
    return(
<div className = "header">

            <div className='ModalcriarConta'>
                <div className='formCriarconta'>
                    <div onClick={()=>fecharModalCriar()}className='closemodal-criar'>X</div>
                    <h2>Criar Conta</h2>
                    <form onSubmit={(e)=> criarConta(e)}>
                        <input id='email-cadastro' type="text" placeholder='Seu email...'/>
                        <input id='username-cadastro'type="text" placeholder='Seu Username'/>
                        <input id='senha-cadastro'type="password" placeholder='Sua senha'/>
                        <input type="submit" value='Criar Conta'/>
                    </form>
                </div>
            </div>

            <div className='ModalUpload'>
                <div className='formUpload'>
                    <div onClick={()=>fecharModalUpload()}className='closemodal-criar'>X</div>
                    <h2>Fazer Upload</h2>
                    <form id="form-upload" onSubmit={(e)=> uploadPost(e)}>
                        <progress id='progress-upload'value={progress}></progress>
                        <input id='titulo-upload' type="text" placeholder='Nome da Sua foto'/>
                        <input onChange={(e)=>setFile(e.target.files[0])} type='file' name='file'/>
                        <input type="submit" value="Postar agora!" />
                    </form>
                </div>
            </div>

            <div className='center'>
            <div className='header-logo'>
              <a href=""> <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"/></a>
            </div>
              {
                (props.user)?
                <div className='header_logadoInfo'>
                  <span>Olá, <b>{props.user}</b></span>
                  <a onClick = {(e)=>abrirModalUpload(e)} href='#'>Postar</a>
                  <a onClick={(e)=>deslogar(e)}>Logout</a> 
                </div>

                :

            <div className='header_loginForm'>
              <form onSubmit={(e)=>logar(e)}>
                        <input id="email-login" type='text' placeholder='Login...'/>
                        <input id="senha-login" type='password' placeholder='senha...'/>
                        <input type='submit' name= 'acao' value='Logar!'/>
              </form>
              <div className='btn-criarConta'>
              <a onClick={(e)=>AbrirModalConta(e)} href='#'>Criar conta!</a>
              </div>
            </div>
              }
            
            </div>
        </div>
    )
    
}

export default Header;
