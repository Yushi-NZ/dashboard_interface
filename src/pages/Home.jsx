import React, { useEffect, useState } from 'react'
import supabase from '../helper/supabaseClient';
import { Navigate } from 'react-router';

function Home() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getSession = async () => {
            const {
                data: {session}
            } = await supabase.auth.getSession();
            setLoading(false);
        };

        getSession();
    },[]);

    if (loading) {
        return <Navigate to="/dashboard" />;
    } else {
        if (authenticated) {
            return <>{children}</>
        }
        return null;
    }
}

export default Home;
