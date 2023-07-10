import {db} from './firebase.js';
import firebase from 'firebase';
import { useEffect, useState } from 'react';

function Post(props){


   const [comentarios,setComentarios] = useState([]);


    useEffect(()=>{
        db.collection('posts').doc(props.id).collection('comentarios').orderBy('timestamp','asc').onSnapshot(function(snapshot){
            setComentarios(snapshot.docs.map(function(document){
              return {id:document.id,info:document.data()}

            }))
        })
    })


    function comentar(id, e){
        e.preventDefault();
        
        let comentarioAtual = document.querySelector('#comentario-'+id).value;

        db.collection('posts').doc(id).collection('comentarios').add({
            nome: props.user,
            comentario: comentarioAtual,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })

        alert('Comentado!!!');

        document.querySelector('#comentario-'+id).value = "";
      }

    return(
        <div className="postSingle">
                  <img src={props.info.image}/>
                  <p><b>{props.info.username}</b>:{props.info.titulo}</p>

                <div className='coments'>
                    <h2>Ultimos Comentarios:</h2>
                {
                    comentarios.map(function(val){
                        <div className="coment-sigle">
                            <p><b>{val.info.nome}:{val.info.comentario}</b></p>
                        </div>
                    })
                }

                </div>
                    {
                        (props.user)?
                  <form onSubmit={(e)=> comentar(props.id,e)}>
                      <textarea id={'comentario-'+props.id}></textarea>
                      <input type='submit' value="Comentar!" />
                  </form>
                  : <div></div>
                    }
              </div>
    )
}

export default Post;