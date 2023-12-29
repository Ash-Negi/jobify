import { Outlet, useNavigation } from "react-router-dom"

const HomeLayout = () => {
  const navigation = useNavigation();
  const isPageLoading = navigation.state === 'loading'

  return (
    <>
    {isPageLoading? <div className="loading"/>: <Outlet/>}
    </>
  )
}

export default HomeLayout