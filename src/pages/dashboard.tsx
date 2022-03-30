import { useContext, useEffect } from "react"
import { AuthContext } from "../contexts/AuthContext"
import { setupAPIClient } from "../services/api"
import { api } from "../services/apiClient"
import { withSSRAuth } from "../utils/withSSRAuth"

export default function Dashboard() {
  useEffect(() => {
    api.get('me').then(response => console.log(response))
      .catch(err => console.error(err))
  }, [])
  const { user } = useContext(AuthContext)

  return (
    <h1>Hello Dashboard {user?.email}</h1>
  )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx)
  const { data } = await apiClient.get('me')
  return {
    props: {
      data
    }
  }
})