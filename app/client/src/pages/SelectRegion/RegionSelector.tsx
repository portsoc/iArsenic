import { CircularProgress, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { navigate } from "wouter/use-browser-location";
import { DropdownDistrict, DropdownDivision, DropdownUnion, DropdownUpazila, RegionTranslations } from "../../types";
import EnglishRegionSelector from "./EnglishRegionSelector";
import BengaliRegionSelector from "./BengaliRegionSelector";
import RegionTranslationsFetcher from "../../utils/RegionTranslationsFetcher";
import { useRoute } from "wouter";
import fetchDropdownData from "../../utils/fetchDropdownData";
import { useAccessToken } from "../../utils/useAccessToken";
import PageCard from "../../components/PageCard";
import WellDataEntryLayout from "../../components/WellDataEntryLayout";
import TranslatableText from "../../components/TranslatableText";
import { useWells } from "../../utils/useWells";

export type RegionErrors = {
    division: boolean;
    district: boolean;
    upazila: boolean;
    union: boolean;
    mouza: boolean;
};

export default function Region(): JSX.Element {
    const [, params] = useRoute('/well/:id/select-region');
    const wellId = params?.id;
    const { data: token } = useAccessToken();
    const { getWell, updateWell } = useWells();
    const { data: well, isLoading } = getWell(wellId);
    const updateWellMutation = updateWell();

    const [dropdownData, setDropdownData] = useState<DropdownDivision[]>([]);
    const [selectedDivision, setSelectedDivision] = useState<DropdownDivision | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<DropdownDistrict | null>(null);
    const [selectedUpazila, setSelectedUpazila] = useState<DropdownUpazila | null>(null);
    const [selectedUnion, setSelectedUnion] = useState<DropdownUnion | null>(null);
    const [selectedMouza, setSelectedMouza] = useState<string | null>(null);
    const [errors, setErrors] = useState<RegionErrors>({
        division: false,
        district: false,
        upazila: false,
        union: false,
        mouza: false,
    });
    const [regionTranslations, setRegionTranslations] = useState<RegionTranslations>();

    function handleValidation() {
        const newErrors = {
            division: !selectedDivision,
            district: !selectedDistrict,
            upazila: !selectedUpazila,
            union: !selectedUnion,
            mouza: !selectedMouza,
        };
        setErrors(newErrors);

        return !Object.values(newErrors).some(value => value);
    }

    async function fetchRegionTranslations() {
        const translations = await RegionTranslationsFetcher();
        setRegionTranslations(translations);
    }

    useEffect(() => {
        async function getDropdownData() {
            setDropdownData(await fetchDropdownData());
        }

        getDropdownData();
        fetchRegionTranslations();
    }, []);

    useEffect(() => {
        if (!well) return;

        setSelectedDivision(
            dropdownData.find(div => div.division === well.division) || null
        );

        setSelectedDistrict(
            dropdownData
                .flatMap(div => div.districts)
                .find(dist => dist.district === well.district) || null
        );

        setSelectedUpazila(
            dropdownData
                .flatMap(div => div.districts.flatMap(d => d.upazilas))
                .find(upz => upz.upazila === well.upazila) || null
        );

        setSelectedUnion(
            dropdownData
                .flatMap(div => div.districts.flatMap(d => d.upazilas.flatMap(u => u.unions)))
                .find(un => un.union === well.union) || null
        );

        setSelectedMouza(well.mouza || null);
    }, [well, dropdownData]);

    async function handleNext() {
        if (!wellId) return
        if (!handleValidation()) return;

        if (!selectedDivision?.division ||
            !selectedDistrict?.district ||
            !selectedUpazila?.upazila ||
            !selectedUnion?.union ||
            !selectedMouza
        ) return;

        const headers: HeadersInit = {};
        if (token) {
            headers['authorization'] = `Bearer ${token.id}`;
        }

        const body: {
            division: string,
            district: string,
            upazila: string,
            union: string,
            mouza: string,
        } = {
            division: selectedDivision.division,
            district: selectedDistrict.district,
            upazila: selectedUpazila.upazila,
            union: selectedUnion.union,
            mouza: selectedMouza,
        };

        try {
            await updateWellMutation.mutateAsync({
                wellId,
                data: body,
            });
            navigate(`/well/${wellId}/staining`);
        } catch (err) {
            console.error('Failed to update well:', err);
        }
    }

    if (!regionTranslations || isLoading) {
        return (
            <Stack direction='column' alignContent='center' justifyContent='center'>
                <CircularProgress />
            </Stack>
        );
    }

    return (
        <WellDataEntryLayout
            title={
                <TranslatableText
                    variant="h4"
                    english="Region"
                    bengali="অঞ্চল"
                />
            }
            onNext={handleNext}
        >
            <PageCard>
                <TranslatableText 
                    mb='1rem'
                    textAlign='center'
                    variant='h5'
                    english='Enter Region Manually'
                    bengali="পুরণ করুন"
                />

                <EnglishRegionSelector
                    dropdownData={dropdownData}
                    selectedDivision={selectedDivision}
                    setSelectedDivision={setSelectedDivision}
                    selectedDistrict={selectedDistrict}
                    setSelectedDistrict={setSelectedDistrict}
                    selectedUpazila={selectedUpazila}
                    setSelectedUpazila={setSelectedUpazila}
                    selectedUnion={selectedUnion}
                    setSelectedUnion={setSelectedUnion}
                    selectedMouza={selectedMouza}
                    setSelectedMouza={setSelectedMouza}
                    errors={errors}
                    setErrors={setErrors}
                />

                <BengaliRegionSelector
                    dropdownData={dropdownData}
                    selectedDivision={selectedDivision}
                    setSelectedDivision={setSelectedDivision}
                    selectedDistrict={selectedDistrict}
                    setSelectedDistrict={setSelectedDistrict}
                    selectedUpazila={selectedUpazila}
                    setSelectedUpazila={setSelectedUpazila}
                    selectedUnion={selectedUnion}
                    setSelectedUnion={setSelectedUnion}
                    selectedMouza={selectedMouza}
                    setSelectedMouza={setSelectedMouza}
                    errors={errors}
                    setErrors={setErrors}
                    rt={regionTranslations}
                />
            </PageCard>
        </WellDataEntryLayout>
    );
}
