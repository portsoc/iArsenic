import { CircularProgress, Stack } from "@mui/material";
import { UserSchema, User } from "shared";
import { navigate } from "wouter/use-browser-location";
import AccessTokenRepo from "../../utils/AccessTokenRepo";
import Config from "../../config";
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

            if (!token) {
                navigate(`${Config.basePath}/login`);
                return;
            }

            const res = await fetch(
                `${Config.basePath}/api/v1/self/user`, {
                    headers: {
                        'authorization': `Bearer ${token.id}`,
                    }
                }
            );

            if (!res.ok) {
                throw new Error(`
                    Failed to fetch user data
                    Status: ${res.statusText}
                    Code: ${res.status}
                `);
            }

            const data = await res.json();
            const user = UserSchema.parse({
                ...data.user,
                createdAt: new Date(data.user.createdAt),
            });

            setUser(user);
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
                />
            </>
        );
    }

    return <ProfileCard user={user} setEditMode={setEditMode} />;
}
