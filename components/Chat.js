import getRecipientEmail from '../utils/getRecipientEmail'
import { useRouter } from 'next/router'
// handling firebase data
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollection } from 'react-firebase-hooks/firestore'
import { auth, db } from '../firebase'
import {query, where, collection} from 'firebase/firestore'
// styles
import styled from 'styled-components'
import { Avatar } from '@material-ui/core'
import classes from '../styles/chat.module.css'

function Chat({id, users}) {
	
	const router = useRouter()
	
	const [user] = useAuthState(auth)

	const [recipientSnapshot] = useCollection(query(collection(db, 'users'), where('email', '==', getRecipientEmail(users, user))))
	
	const enterChat = () => {
		router.push(`/chat/${id}`)
	}
	
	const recipient = recipientSnapshot?.docs?.[0]?.data()
	
	const recipientEmail = getRecipientEmail(users, user)
	
	return (
		<div className={classes.container} onClick={enterChat}>
			{recipient ? (
				<UserAvatar src={recipient?.photoURL} />
			): (
				<UserAvatar>{recipientEmail[0]}</UserAvatar>
			)}
			<p>{recipientEmail}</p>
		</div>
	)
}

export default Chat



const UserAvatar = styled(Avatar)`
	margin: 5px;
	margin-right: 15px;
`