const getPhotoUrl = (photoUrl?: string | string[]): string => {
	if (typeof photoUrl === 'string') {
		return photoUrl
	} else if (Array.isArray(photoUrl) && photoUrl.length > 0) {
		return photoUrl[0]
	}
	return 'https://th.bing.com/th/id/OIP.IMYEa-ECkbVQ66EO1LCUDwHaHa?rs=1&pid=ImgDetMain' // URL изображения по умолчанию
}
export default getPhotoUrl
