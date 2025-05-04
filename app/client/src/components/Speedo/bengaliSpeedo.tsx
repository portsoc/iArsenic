import ReactSpeedometer, { CustomSegmentLabelPosition } from "react-d3-speedometer";

interface props {
    value: number | undefined
}

export default function BengaliSpeedo({ value }: props): JSX.Element {
    return (
        <ReactSpeedometer
            maxValue={5}
            value={value}
            needleHeightRatio={0.7}
            currentValueText=''
            needleColor="steelblue"
            needleTransitionDuration={1000}
            segmentColors={[
                '#01ce35',
                '#9acb31',
                '#ffcc32',
                '#ff6600',
                '#fe0000',
            ]}
            customSegmentLabels={[
                {
                    text: 'বিরল',
                    position: CustomSegmentLabelPosition.Outside,
                    color: 'black',
                },
                {
                    text: 'কম',
                    position: CustomSegmentLabelPosition.Outside,
                    color: 'black',
                },
                {
                    text: 'মাঝারি',
                    position: CustomSegmentLabelPosition.Outside,
                    color: 'black',
                },
                {
                    text: 'উচ্চ',
                    position: CustomSegmentLabelPosition.Outside,
                    color: 'black',
                },
                {
                    text: 'গুরুতর',
                    position: CustomSegmentLabelPosition.Outside,
                    color: 'black',
                },
            ]}
        />
    );
}