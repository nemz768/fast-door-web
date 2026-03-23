
import { useRouter } from "next/navigation";
import "./headerCreation.scss";
import Logo from "../logo/Logo";


export default function HeaderCreation() {

  const router = useRouter();

  return (
    <div className="header-creation">
      <div className="logo-wrapper">
            <Logo format={'lefted'}/>
      </div>

      <button
        onClick={() => router.back()}
        className="header-creation-btn"
      >
        <span>
            <svg width="46" height="24" viewBox="0 0 46 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M43.1875 13.5471C44.2921 13.5471 45.1875 12.6517 45.1875 11.5471C45.1875 10.4425 44.2921 9.54712 43.1875 9.54712V11.5471V13.5471ZM-0.000274658 11.5471L19.9997 23.0941V0.000113487L-0.000274658 11.5471ZM43.1875 11.5471V9.54712L17.9997 9.54712V11.5471V13.5471L43.1875 13.547１V１１．５４７１Z" fill="white"/>
</svg>
        </span>
        Назад
      </button>
    </div>
  );
}