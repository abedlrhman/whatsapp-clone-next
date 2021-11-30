import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
// handling firebase data
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '../firebase'
import { collection, query, orderBy, setDoc, doc, serverTimestamp, addDoc, where } from 'firebase/firestore'
import { useCollection } from 'react-firebase-hooks/firestore'
// styles and icons
import { Avatar, IconButton } from '@material-ui/core'
import classes from '../styles/chatScreen.module.css'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import AttachFileIcon from '@material-ui/icons/AttachFile'
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon'
import MicIcon from '@material-ui/icons/Mic'
import SendIcon from '@material-ui/icons/Send'
// components
import Message from '../components/Message'
import getRecipientEmail from '../utils/getRecipientEmail'
import TimeAgo from 'timeago-react'

function ChatScreen({chat, messages}) {

	const [user] = useAuthState(auth)

	const [input, setInput] = useState('')

	const router = useRouter()

	const endIfMessagesRef = useRef(null)

	const ref = collection(db, 'chats', router.query.id, 'messages')

	const [messagesSnapshot] = useCollection(query(ref, orderBy('timestamp', 'asc')))

	const [recipientSnapshot] = useCollection(query(collection(db, 'users'), where('email', '==', getRecipientEmail(chat.users, user))))
	
	const showMessages = () => {
		if(messagesSnapshot) {
			return messagesSnapshot.docs.map(message => (
				<Message 
					key= {message.id}
					user= {message.data().user}
					message= {{
						...message.data(),
						timestamp: message.data().timestamp?.toDate().getTime(),
					}}
				/>
			))
		}

	}

	const scrollToBottom = () => {
		endIfMessagesRef.current.scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		})
	}
	
	const sendMessage = (e) => {
		e.preventDefault()

		// update the last seen...
		setDoc(doc(db, 'users', user.uid), {
			lastSeen: serverTimestamp() 
		}, {merge: true})

		addDoc(collection(db, "chats", router.query.id, 'messages'), {
			timestamp: serverTimestamp(),
			message: input,
			user: user.email,
			photoURL: user.photoURL
		});

		setInput('')
		scrollToBottom()
	}

	const recipient = recipientSnapshot?.docs?.[0]?.data()
	const recipientEmail = getRecipientEmail(chat.users, user)
	
	return (
		<div>
			<header className={classes.header}>
				{recipient ? (
					<Avatar src={recipient?.photoURL} />
				): (
					<Avatar>{recipientEmail[0]}</Avatar>
				)}

				<div className={classes.headerInfo}>
					<h3>{recipientEmail}</h3>
					{recipientSnapshot ? (
						<p>last active: {' '}
						{recipient?.lastSeen?.toDate() ? (
							<TimeAgo datetime={recipient?.lastSeen?.toDate()} />
						): 'Unavailable'}
						</p>
					): (
						<p>loading last active...</p>
					)}
				</div>

				<div>
					<IconButton>
						<AttachFileIcon />
					</IconButton>
					<IconButton>
						<MoreVertIcon />
					</IconButton>
				</div>
			</header>

			<div className={classes.messagesContainer}>
				{showMessages()}
				<div className={classes.endOfMessage} ref={endIfMessagesRef} />
			</div>

			<form className={classes.InputContainer}>
				<InsertEmoticonIcon />
				<input className={classes.input} value={input} onChange={ e => setInput(e.target.value)} />
				<button disabled={!input} type="submit" onClick={sendMessage} className={classes.sendButton}>send <SendIcon /></button>
				<MicIcon />
			</form>
			
		</div>
	)
}


export default ChatScreen


