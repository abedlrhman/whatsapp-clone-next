const getRecipientEmail = (users, currentUser) => (
	users?.filter((userToFilter) => userToFilter !== currentUser?.email)[0]
)

export default getRecipientEmail