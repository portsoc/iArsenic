import { Stack, CircularProgress } from "@mui/material";
import { useState } from "react";
import { useAccessToken } from "../../utils/useAccessToken";
import EditProfileCard from "./EditProfileCard";
import ProfileCard from "./ProfileCard";

export default function ProfilePage(): JSX.Element {
    const [editMode, setEditMode] = useState(false);
    const [saving, setSaving] = useState(false);
    const { data: token } = useAccessToken();
    const [user, setUser] = useState(token?.user);

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
