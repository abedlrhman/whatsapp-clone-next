import { useRouter } from 'next/router'
import { Avatar, Button, IconButton } from '@material-ui/core'
// handling firebase data
import { auth, db } from '../firebase'
import { signOut} from 'firebase/auth'
import { collection, where, query, addDoc } from "firebase/firestore"; 
import {useAuthState} from 'react-firebase-hooks/auth'
import {useCollection} from 'react-firebase-hooks/firestore'
//css
import styled from 'styled-components'
import classes from '../styles/sidebar.module.css'
// material ui icons
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ChatIcon from '@material-ui/icons/Chat';
import SearchIcon from '@material-ui/icons/Search';
// email validation
import * as EmailValidator from 'email-validator'
//components
import Chat from './Chat'


function Sidebar() {

	const router = useRouter()

	const [user] = useAuthState(auth)
	const useChatRef = query(collection(db, "chats"), where('users', 'array-contains', user.email));
	const [chatsSnapshot] = useCollection(useChatRef)

	const createChat = async () => {
		const input = prompt('Please enter an email address for the user you wish to chat with')

		if (!input) return null

		if(EmailValidator.validate(input) && !chatAlreadyExists(input) && input !== user.email) {
			// we need to add the chat into the db "chat" collection
			const newChatCollection = collection(db, "chats");
			await addDoc(newChatCollection, {
				users: [user.email, input]
			});
		}


	}

	const chatAlreadyExists = (recipientEmail) => 
		!!chatsSnapshot?.docs.find(chat => chat.data().users.find( user => user === recipientEmail)?.length > 0)

	const logOut = () =>{
		router.push('/')
		signOut(auth)
	}
	
	return (
		<div className={classes.container}>
			<header className={classes.header}>
				<UserAvatar onClick={logOut} src={user.photoURL} />

				<div>
					<IconButton>
						<ChatIcon />
					</IconButton>
					<IconButton>
						<MoreVertIcon />
					</IconButton>
				</div>
			</header>

			<div className={classes.search}>
				<SearchIcon />
				<input className={classes.searchInput} placeholder="Search in chats"/>
			</div>

			<SidebarButton onClick={createChat}>start a new chat</SidebarButton>

			{/* list of chats */}
			{chatsSnapshot?.docs.map(chat => (
				<Chat 
					key= {chat.id}
					id= {chat.id}
					users= {chat.data().users}
				/>
			))}
		</div>
	)
}

export default Sidebar


const SidebarButton = styled(Button)`
	width: 100%;

	&&&{
		border-top: 1px solid whitesmoke;
		border-bottom: 1px solid whitesmoke;
	}
`
const UserAvatar = styled(Avatar)`
	cursor: pointer;
	:hover {
		opacity: 0.8;
	}
`
