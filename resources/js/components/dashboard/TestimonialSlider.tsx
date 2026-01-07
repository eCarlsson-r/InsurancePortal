import React from "react";
import Slider from "react-slick";

const TestimonialSlider = () => {
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    return (
        <Slider className="testimonial-widget-one" {...settings}>
            <div className="item">
                <div className="testimonial-content text-right">
                    <div className="testimonial-text">
                        <i className="fa fa-quote-left"></i> Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
                        <i className="fa fa-quote-right"></i>
                    </div>
                    <div className="media">
                        <div className="media-body">
                            <div className="testimonial-author">TYRION LANNISTER</div>
                            <div className="testimonial-author-position">Founder-Ceo. Dell Corp</div>
                        </div>
                        <img className="testimonial-author-img ml-3" style={{ width: "50px" }} src="/images/avatar/1.png" alt="" />
                    </div>
                </div>
            </div>
            <div className="item">
                <div className="testimonial-content text-right">
                    <div className="testimonial-text">
                        <i className="fa fa-quote-left"></i> Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
                        <i className="fa fa-quote-right"></i>
                    </div>
                    <div className="media">
                        <div className="media-body">
                            <div className="testimonial-author">TYRION LANNISTER</div>
                            <div className="testimonial-author-position">Founder-Ceo. Dell Corp</div>
                        </div>
                        <img className="testimonial-author-img ml-3" style={{ width: "50px" }} src="/images/avatar/1.png" alt="" />
                    </div>
                </div>
            </div>
        </Slider>
    );
};

export default TestimonialSlider;
