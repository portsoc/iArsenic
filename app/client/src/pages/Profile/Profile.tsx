import { Stack, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useAccessToken } from "../../utils/useAccessToken";
import EditProfileCard from "./EditProfileCard";
import ProfileCard from "./ProfileCard";
import { User } from "iarsenic-types";

export default function ProfilePage(): JSX.Element {
    const [editMode, setEditMode] = useState(false);
    const [saving, setSaving] = useState(false);
    const { data: token } = useAccessToken();
    const [user, setUser] = useState<User>();

    console.log('--')
    console.log(token)
    console.log(user)

    useEffect(() => {
        if (!token) return
        if (token.user === undefined) return

        setUser(token.user)
    }, [token])

    if (!user) {
        return (
            <Stack alignItems='center' justifyContent='center'>
                <CircularProgress />
            </Stack>
        );
    }

    if (editMode) {
        return (
            <>
                {saving && (
                    <Stack alignItems='center' justifyContent='center'>
                        <CircularProgress />
                    </Stack>
                )}
                <EditProfileCard
                    user={user}
                    setEditMode={setEditMode}
                    setSaving={setSaving}
                    setUser={setUser}
                />
            </>
        );
    }

    return <ProfileCard user={user} setEditMode={setEditMode} />;
}
