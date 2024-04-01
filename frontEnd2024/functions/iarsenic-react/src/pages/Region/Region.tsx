import { Container, Typography } from "@mui/material";
import config from "../../config";
import { useEffect, useState } from "react";

export default function Region(): JSX.Element {
    const [dropdownData, setDropdownData] = useState(false)

    async function fetchDropdownData() {
        const response = await fetch(`${config.basePath}/dropdown-data.js`)
        const data = await response.json()
        setDropdownData(data)
    }

    useEffect(() => {
        fetchDropdownData()
    }, [])

    useEffect(() => {
        console.log(dropdownData)
    }, [dropdownData])
    return (
        <Container>
            <Typography>Hello From Region Page</Typography>
        </Container>
    )
}