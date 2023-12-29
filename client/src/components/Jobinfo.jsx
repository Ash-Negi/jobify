import Wrapper from "../assets/wrappers/Jobinfo"

export const Jobinfo = ({icon, text}) => {
  return <Wrapper>
    <span className="job-icon">{icon}</span>
    <span className="job-text">{text}</span>
  </Wrapper>
}

export default Jobinfo
