import InputError from '@/components/input-error';
import { Button, Spinner } from 'react-bootstrap';
import { register } from '@/wayfinder/routes';
import { store } from '@/wayfinder/routes/login';
import { request } from '@/wayfinder/routes/password';
import { Form, Head, Link } from '@inertiajs/react';


interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: LoginProps) {
    return (
        <div className="authincation vh-100">
            <Head title="Log in" />
            <div className="container vh-100">
                <div className="row justify-content-center vh-100 align-items-center">
                    <div className="col-md-6">
                        <div className="authincation-content">
                            <div className="row no-gutters">
                                <div className="col-xl-12">
                                    <div className="auth-form">
                                        <div className="text-center mb-3">
                                            <Link href="/">
                                                <img src="/images/logo-full.png" alt="" style={{ maxWidth: '150px' }} />
                                            </Link>
                                        </div>
                                        <h4 className="text-center mb-4">Sign in your account</h4>
                                        
                                        {status && (
                                            <div className="alert alert-success text-center mb-4">
                                                {status}
                                            </div>
                                        )}

                                        <Form
                                            {...store.form()}
                                            resetOnSuccess={['password']}
                                        >
                                            {({ processing, errors }) => (
                                                <>
                                                    <div className="form-group mb-3">
                                                        <label htmlFor="email" className="mb-1"><strong>Email</strong></label>
                                                        <input
                                                            id="email"
                                                            type="email"
                                                            name="email"
                                                            className="form-control"
                                                            required
                                                            autoFocus
                                                            tabIndex={1}
                                                            autoComplete="email"
                                                            placeholder="hello@example.com"
                                                        />
                                                        <InputError message={errors.email} />
                                                    </div>
                                                    
                                                    <div className="form-group mb-3">
                                                        <label htmlFor="password" className="mb-1"><strong>Password</strong></label>
                                                        <input
                                                            id="password"
                                                            type="password"
                                                            name="password"
                                                            className="form-control"
                                                            required
                                                            tabIndex={2}
                                                            autoComplete="current-password"
                                                            placeholder="Password"
                                                        />
                                                        <InputError message={errors.password} />
                                                    </div>

                                                    <div className="form-row d-flex justify-content-between mt-4 mb-2">
                                                        <div className="form-group">
                                                            <div className="custom-control custom-checkbox ml-1">
                                                                <input
                                                                    type="checkbox"
                                                                    id="remember"
                                                                    name="remember"
                                                                    className="custom-control-input"
                                                                    tabIndex={3}
                                                                />
                                                                <label className="custom-control-label" htmlFor="remember">Remember me</label>
                                                            </div>
                                                        </div>
                                                        <div className="form-group">
                                                            {canResetPassword && (
                                                                <Link href={request()} className="text-primary" tabIndex={5}>
                                                                    Forgot Password?
                                                                </Link>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="text-center">
                                                        <Button
                                                            type="submit"
                                                            className="btn btn-primary btn-block"
                                                            tabIndex={4}
                                                            disabled={processing}
                                                        >
                                                            {processing && <Spinner className="mr-2" />}
                                                            Sign me in
                                                        </Button>
                                                    </div>
                                                </>
                                            )}
                                        </Form>

                                        {canRegister && (
                                            <div className="new-account mt-3 text-center">
                                                <p>Don't have an account? <Link href={register()} className="text-primary">Sign up</Link></p>
                                            </div>
                                        )}
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
