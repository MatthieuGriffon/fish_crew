

export const fetchMarkers = async (token: string | null, authContext: any, setFetchedMarkers: any, setRefreshMap: any) => {
    if (token && authContext && authContext.user) {
      try {
        const response = await fetch(`/api/spot/getMarkers?userId=${authContext.user?.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const { markers } = await response.json();
        setFetchedMarkers(markers);
        localStorage.setItem('fetchedMarkers', JSON.stringify(markers));
        setRefreshMap((prev: any) => !prev);
      } catch (error) {
        console.error('Failed to fetch markers:', error);
      }
    }
  };

  export const fetchUserGroups = async (token: string | null, authContext: any, setUserGroups: any) => {
    if (token && authContext && authContext.user) {
      try {
        const response = await fetch(`/api/group?userId=${authContext.user?.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const { userGroups } = await response.json();
        setUserGroups(userGroups);
      } catch (error) {
        console.error('Failed to fetch user groups:', error);
      }
    }
  };

  export const checkAndSetUserGroups = (setUserGroups: any, authContext: any) => {
    const token = localStorage.getItem('token');
    const storedUserGroups = localStorage.getItem('userGroups');
    if (storedUserGroups) {
      setUserGroups(JSON.parse(storedUserGroups));
    } else {
      fetchUserGroups(token, authContext, setUserGroups);
    }
  };
  
 
  
  
  