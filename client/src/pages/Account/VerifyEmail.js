import React, {useContext, useState, useEffect} from 'react'
import swal from 'sweetalert';
import { Redirect } from 'react-router';
import {FirebaseContext} from '../../context/auth'

function getParameterByName(name) {
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if( results == null )
      return "";
    else
      return decodeURIComponent(results[1].replace(/\+/g, " "));
}

function VerifyEmail(props) {
    const {firebase} = useContext(FirebaseContext)

    const [goHome, setHome] = useState(false);
    const [goSignIn, setSignIn] = useState(false);

    useEffect(() => {
        var mode = getParameterByName('mode');
        var actionCode = getParameterByName('oobCode');
        
        var auth = firebase.auth;

        switch (mode) {
            case 'verifyEmail': {
                auth.applyActionCode(actionCode).then(function(resp) {
                    swal("Success", "Your email has successfully been verified", "success");

                    setSignIn(true);
                }).catch(function(error) {
                    swal("Error", "Invalid or expired code, please try verifying your email again. If you have already verified your email, then no futher action is needed.", "error");

                    setHome(true);
                });
                break;
            }
        }
    })

    if (goHome) {
        return <Redirect to='/' />
    } else if (goSignIn) {
        return <Redirect to='/login' />
    } else {
        return (
            <div></div>
        )
    }
}

export default VerifyEmail;
