import InputError from '@/components/input-error';
import { login } from '@/wayfinder/routes';
import { store } from '@/wayfinder/routes/register';
import { Form, Head, Link } from '@inertiajs/react';
import { Button, Spinner } from 'react-bootstrap';

export default function Register() {
    return (
        <div className="authincation vh-100">
            <Head title="Register" />
            <div className="container vh-100">
                <div className="row justify-content-center vh-100 align-items-center">
                    <div className="col-md-6">
                        <div className="authincation-content">
                            <div className="row no-gutters">
                                <div className="col-xl-12">
                                    <div className="auth-form">
                                        <h4 className="text-center mb-4">
                                            Sign up your account
                                        </h4>

                                        <Form
                                            {...store.form()}
                                            resetOnSuccess={[
                                                'password',
                                                'password_confirmation',
                                            ]}
                                            disableWhileProcessing
                                        >
                                            {({ processing, errors }) => (
                                                <>
                                                    <div className="form-group mb-3">
                                                        <label
                                                            htmlFor="name"
                                                            className="mb-1"
                                                        >
                                                            <strong>
                                                                Username
                                                            </strong>
                                                        </label>
                                                        <input
                                                            id="name"
                                                            type="text"
                                                            className="form-control"
                                                            required
                                                            autoFocus
                                                            tabIndex={1}
                                                            autoComplete="name"
                                                            name="name"
                                                            placeholder="Full name"
                                                        />
                                                        <InputError
                                                            message={
                                                                errors.name
                                                            }
                                                        />
                                                    </div>

                                                    <div className="form-group mb-3">
                                                        <label
                                                            htmlFor="email"
                                                            className="mb-1"
                                                        >
                                                            <strong>
                                                                Email
                                                            </strong>
                                                        </label>
                                                        <input
                                                            id="email"
                                                            type="email"
                                                            className="form-control"
                                                            required
                                                            tabIndex={2}
                                                            autoComplete="email"
                                                            name="email"
                                                            placeholder="hello@example.com"
                                                        />
                                                        <InputError
                                                            message={
                                                                errors.email
                                                            }
                                                        />
                                                    </div>

                                                    <div className="form-group mb-3">
                                                        <label
                                                            htmlFor="password"
                                                            className="mb-1"
                                                        >
                                                            <strong>
                                                                Password
                                                            </strong>
                                                        </label>
                                                        <input
                                                            id="password"
                                                            type="password"
                                                            className="form-control"
                                                            required
                                                            tabIndex={3}
                                                            autoComplete="new-password"
                                                            name="password"
                                                            placeholder="Password"
                                                        />
                                                        <InputError
                                                            message={
                                                                errors.password
                                                            }
                                                        />
                                                    </div>

                                                    <div className="form-group mb-4">
                                                        <label
                                                            htmlFor="password_confirmation"
                                                            className="mb-1"
                                                        >
                                                            <strong>
                                                                Confirm Password
                                                            </strong>
                                                        </label>
                                                        <input
                                                            id="password_confirmation"
                                                            type="password"
                                                            className="form-control"
                                                            required
                                                            tabIndex={4}
                                                            autoComplete="new-password"
                                                            name="password_confirmation"
                                                            placeholder="Confirm password"
                                                        />
                                                        <InputError
                                                            message={
                                                                errors.password_confirmation
                                                            }
                                                        />
                                                    </div>

                                                    <div className="text-center">
                                                        <Button
                                                            type="submit"
                                                            className="btn btn-primary btn-block"
                                                            tabIndex={5}
                                                            disabled={
                                                                processing
                                                            }
                                                        >
                                                            {processing && (
                                                                <Spinner className="mr-2" />
                                                            )}
                                                            Sign me up
                                                        </Button>
                                                    </div>
                                                </>
                                            )}
                                        </Form>

                                        <div className="new-account mt-3 text-center">
                                            <p>
                                                Already have an account?{' '}
                                                <Link
                                                    href={login()}
                                                    className="text-primary"
                                                >
                                                    Sign in
                                                </Link>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
