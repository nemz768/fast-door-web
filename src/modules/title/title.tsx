
import './title.scss'


interface TitleProps {
    pageTitle: string;
    centered?: boolean;

}

export default function Title({pageTitle, centered = false}: TitleProps) {
    return !centered ? <h1 className='title'>{pageTitle}</h1> : <h1 className='title' style={{textAlign: "center"}}>{pageTitle}</h1>
}