import React from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import nofound from 'public/notfound.jpeg'
interface ImageComponentProps {
	src: string
	className: string
	alt?: string
}

const ImageComponent: React.FC<ImageComponentProps> = ({
	src = nofound,
	className,
	alt = 'not found',
}) => {
	return <LazyLoadImage src={src} alt={alt} className={className} />
}

export default ImageComponent
