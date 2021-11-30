import { Button } from '@material-ui/core'
import Head from 'next/head'
import Image from 'next/image'
import logo from '../assets/images/logo.png'
import classes from '../styles/login.module.css'
import { provider, auth } from '../firebase'
import {signInWithPopup} from "firebase/auth"


function login() {

	const signInHandler = () => {
		signInWithPopup(auth, provider).catch(alert)
	}
	
	return (
		<div className={classes.container}>
			<Head>
				<title>Login</title>
			</Head>

			<div className={classes.loginContainer}>
				<Image 
					src={logo} alt='logo' 
					width={200}
        	height={200}
				/>
				<Button style={{marginTop: 50}} onClick={signInHandler} variant='outlined'>Sign in with Google</Button>
			</div>	
		</div>
	)
}

export default login


