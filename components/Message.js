import moment from 'moment'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../firebase'
import classes from '../styles/message.module.css'

function Message({user, message}) {

	const [userLoggedIn] = useAuthState(auth)

	const sender = classes.sender
	const receiver = classes.receiver

	const TypeOfMessage = user === userLoggedIn.email ? sender : receiver
	
	return (
		<div className={classes.container}>
			<p className={`${TypeOfMessage} ${classes.messageElement}`}>
				{message.message}
				<span className={classes.timestamp}>
					{message.timestamp ? moment(message.timestamp).format('LT'): '...'}
				</span>
			</p>
		</div>
	)
}

export default Message
