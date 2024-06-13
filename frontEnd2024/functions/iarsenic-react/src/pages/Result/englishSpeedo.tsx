import ReactSpeedometer, { CustomSegmentLabelPosition } from "react-d3-speedometer";

interface props {
    value: number | undefined
}

export default function EnglishSpeedo({ value }: props): JSX.Element {
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
                    text: 'Rare',
                    position: CustomSegmentLabelPosition.Outside,
                    color: 'black',
                },
                {
                    text: 'Low',
                    position: CustomSegmentLabelPosition.Outside,
                    color: 'black',
                },
                {
                    text: 'Medium',
                    position: CustomSegmentLabelPosition.Outside,
                    color: 'black',
                },
                {
                    text: 'High',
                    position: CustomSegmentLabelPosition.Outside,
                    color: 'black',
                },
                {
                    text: 'Severe',
                    position: CustomSegmentLabelPosition.Outside,
                    color: 'black',
                },
            ]}
        />
    );
}