import Head from 'next/head'
import Sidebar from '../../components/Sidebar'
import ChatScreen from '../../components/ChatScreen'
// css
import classes from '../../styles/chatId.module.css'
// handling firebase data
import {doc, collection, query, orderBy, getDocs, getDoc} from 'firebase/firestore'
import { auth, db } from '../../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import getRecipientEmail from '../../utils/getRecipientEmail'


function Chat({chat, messages}) {
	
	const [user] = useAuthState(auth)

	return (
		<div className={classes.container}>
			<Head>
				<title>Chat width {getRecipientEmail(chat.users, user)}</title>
			</Head>
			<Sidebar />
			<div className={classes.chatContainer}>
				<ChatScreen 
					chat= {chat}
					messages= {messages}
				/>
			</div>
		</div>
	)
}

export default Chat

export async function getServerSideProps(context) {
	const ref = collection(db, 'chats', context.query.id, 'messages')

	//prep the messages on the server
	const messagesRes = await getDocs(query(ref, orderBy('timestamp', 'asc')))

	const messages = messagesRes.docs.map(doc => ({
		id: doc.id,
		...doc.data()
	})).map(messages => ({
		...messages,
		timestamp: messages.timestamp.toDate().getTime()
	}))

	// prep the chats
	const chatRes = await getDoc(doc(db, 'chats', context.query.id))
	const chat = {
		id: chatRes.id,
		...chatRes.data()
	}

	return {
		props: {
			messages: JSON.stringify(messages),
			chat: chat
		}
	}

}
