

export const fetchMarkers = async (token: string | null, authContext: any, setFetchedMarkers: any, setSavedMarkers: any) => {
  if (token && authContext && authContext.user) {
    try {
      const userId = authContext.user.id;
      const response = await fetch(`/api/spot/getMarkers?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data) {
        setFetchedMarkers(data);
        localStorage.setItem('fetchedMarkers', JSON.stringify(data));
        setSavedMarkers(data); // Si nécessaire, assurez-vous de définir également les marqueurs sauvegardés
      } else {
        console.log('No markers found');
      }
    } catch (error) {
      console.error('Failed to fetch markers:', error);
    }
  } else {
    console.log('Token or authContext not available');
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
  
 
  
  
  