import React from "react";

const Footer = () => {
  return (
    <>
      <footer>
        {/* <!-- Footer Start--> */}

        {/* <!-- footer-bottom area --> */}
        <div className="footer-bottom-area footer-bg">
          <div className="container">
            <div className="footer-border">
              <div className="row d-flex justify-content-between align-items-center">
                <div className="col-xl-10 col-lg-10 ">
                  <div className="footer-copy-right">
                    <p>
                      Bản quyền &copy;
                      <script>document.write(new Date().getFullYear());</script>
                      <i className="fa fa-heart" aria-hidden="true"></i> từ{" "}
                      <a
                        href="https://www.instagram.com/khuong.iss/"
                        target="_blank"
                      >
                        CK
                      </a>
                    </p>
                  </div>
                </div>
                <div className="col-xl-2 col-lg-2">
                  <div className="footer-social f-right">
                    <a href="https://www.facebook.com/khuong.iss">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="#">
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a href="#">
                      <i className="fas fa-globe"></i>
                    </a>
                    <a href="#">
                      <i className="fab fa-behance"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
