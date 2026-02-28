import "./logo.scss"
import logo from '@/assets/images/Logo.png'


interface LogoProps {
    format?: 'centered' | 'lefted';

}

export default function Logo({ format = 'centered' }: LogoProps) {

    return (
        <img width={291}
            height={104} src={logo.src} alt="FastDoor" className={format === 'centered' ? 'logo' : 'logo-lefted'} />
    )
}