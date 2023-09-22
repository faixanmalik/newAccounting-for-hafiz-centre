import { useState , useEffect } from 'react'
import '@/styles/globals.css'
import "../styles/style.scss";

// React top loading bar
import LoadingBar from 'react-top-loading-bar'
import { useRouter } from 'next/router';
import Footer from '../../components/Footer'
import Navbar from '../../components/Navbar'

export default function App({ Component, pageProps }) {

  const router = useRouter();

  //  react top loading bar
  const [progress, setProgress] = useState(0)
  const [user, setUser] = useState({value: null})
  const [userEmail, setUserEmail] = useState('')
  const [key, setKey] = useState(0)


  //  Use Effect for routerChange
  useEffect(() => {

    router.events.on('routeChangeStart', ()=>{
      setProgress(75);
    });
    router.events.on('routeChangeComplete', ()=>{
      setProgress(100);
    }, []);

    let myUser = JSON.parse(localStorage.getItem("myUser"));

    if( myUser ){
      setUserEmail(myUser.email);
      setUser({value: myUser.token , role: myUser.role, email: myUser.email, name: myUser.name, department: myUser.department });
      setKey(Math.random());
    }
    
  }, [router.query, userEmail])

  
  useEffect(() => {

    async function fetchData() {
      let getUser = JSON.parse(localStorage.getItem("myUser"));
      if(getUser){

        let token = getUser.token;
      
        const data = { token };
        let res = await fetch(`/api/getuser`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
        let response = await res.json()
        if(response.success === false){
          router.push(`/login`);
        }
      }
      else{
        router.push(`/login`);
      }
      
    }
    fetchData();

  }, [])
  



  // Logout function
  const logout = ()=>{
    localStorage.removeItem("myUser");
    setUser({value:null});
    setKey(Math.random());
    router.push(`/login`);
  }


  return <>
    <Navbar key={key} user={user} logout={logout}/>
    <LoadingBar color='#0800FF' height={3} progress={progress} waitingTime={300} onLoaderFinished={() => setProgress(0)}/>  
    <Component {...pageProps} userEmail={userEmail}/>
    <Footer/>
  </>
}