import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import config from "../../config";

export default function StainingGuide(): JSX.Element {
    const images = [
        {
            heading: 'Red Staining',
            body: 'Red staining is associated with iron reduction that may lead to the release of arsenic and will likely indicate unsafe drinking-water, particularly for shallow wells.',
            imgPath: `${config.basePath}/red_platform_1.jpg`,
        },
        {
            heading: 'Black Staining',
            body: 'Black staining is associated with manganese reduction and will likely indicate safe drinking-water; any arsenic released due to manganese reduction will be absorbed back into the unreduced iron.',
            imgPath: `${config.basePath}/black_platform_1.jpg`,
        },
    ];

    // Slider settings
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
    };

    return (
        <div>
            <h1>Staining Guide</h1>
            <Slider {...settings}>
                {images.map((image, index) => (
                    <div key={index}>
                        <h2>{image.heading}</h2>
                        <p>{image.body}</p>
                        <img src={image.imgPath} alt={`Staining - ${image.heading}`} style={{ width: '100%', maxHeight: '400px', margin: 'auto' }}/>
                    </div>
                ))}
            </Slider>
        </div>
    );
}
