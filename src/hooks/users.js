import { useEffect, useState } from 'react';
import { Users } from '@service/index';

const useUsersList = (params) => {
    const [list, setList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        (async () => {
          setIsLoading(true)
          try {
            const response = await Users.getUsers(params);
            setList(response?.data?.results || [])
          } catch (err) {
            setList([])
          } finally {
            setIsLoading(false)
          }
        })()
        return () => {
          setIsLoading(false)
          setList([])
        }
      }, [params])

    return { isLoading, list }
}

export { useUsersList }