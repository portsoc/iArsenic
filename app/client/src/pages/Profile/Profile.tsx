import { CircularProgress, Stack } from "@mui/material";
import { User } from "shared";
import { navigate } from "wouter/use-browser-location";
import AccessTokenRepo from "../../utils/AccessTokenRepo";
import { useEffect, useState } from "react";
import ProfileCard from "./ProfileCard";
import EditProfileCard from "./EditProfileCard";

export default function ProfilePage(): JSX.Element {
    const [user, setUser] = useState<User>();
    const [editMode, setEditMode] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function getUser() {
            const token = await AccessTokenRepo.get();

            if (!token || !token.user) {
                navigate(`/login`);
                return;
            }

            setUser(token.user);
        }

        if (saving) return; // dont update while saving
        getUser();
    }, [saving]);

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
