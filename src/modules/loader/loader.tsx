
import { TailSpin, Audio } from 'react-loader-spinner'



// true - classic spinner, false - not
// flag can be neccessary for some loaders

interface LoaderTypes {
    spinType: boolean;
    flag?: boolean;
}

export default function Loader({spinType, flag}: LoaderTypes) {

    return (
        <div className="loading-container" style={spinType ? {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }
      : {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }
    }>
        {spinType ? 
        <TailSpin 
        height="80"
        width="80"
        color="#8B6649"
        ariaLabel="tail-spin-loading"
        visible={flag}
        /> 
        : <Audio
          height="80"
          width="80"
          color="#8B6649"
          ariaLabel="audio-loading"
          visible={true}
        /> 
        }
      </div>
    )
}