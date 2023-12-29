import styled from "styled-components"
import Wrapper from '../assets/wrappers/LandingPage'
import { Link } from "react-router-dom"
import { Logo } from "../components"


const Landing = () => {
  return (
    <Wrapper>
      <nav>
        <Logo/>
      </nav>
      <div className="container page">
        <div className="info">
          <h1>
            job <span>tracking</span> app
          </h1>
          <p>
            Organize your job search
          </p>
          <Link to='/register' className="btn register-link">
            Register
          </Link>
          <Link to='/login' className="btn">
            Login / Demo user
          </Link>
        </div>
      </div>
    </Wrapper>
  )
}

export default Landing