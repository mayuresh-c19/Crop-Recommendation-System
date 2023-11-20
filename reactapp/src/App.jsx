import { useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { AboutUs } from "./pages/AboutUs";

function App() {

  const [isLogged, setLogged] = useState(true);

  return (
    <div className="App">
      <BrowserRouter>
        

        <Routes>
          <Route path="/" element={ <Home logged={isLogged} /> } />
          <Route path="/login" element={ <Login/> } />
          <Route path="/dashboard">
            <Route index element={<Dashboard/>}></Route>
          </Route>
          <Route path="/about" element={ <AboutUs/> }/>

          <Route path="*" element={ <Home logged={isLogged}/> } />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
