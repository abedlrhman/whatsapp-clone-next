import Image from 'next/image'
import { Circle } from 'better-react-spinkit'
// import assets
import logo from '../assets/images/logo.png'

function Loading() {
	return (
		<center style={{ display: 'grid', placeItems: 'center', height: '100vh'}}>
			<div>
				<Image
					src={logo}
					alt='logo'
					width={200}
					height={200}
				/>
				<Circle color='#3cbc28' size={60} />
			</div>
		</center>
	)
}

export default Loading

