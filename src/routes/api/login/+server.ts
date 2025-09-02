import { SERVER_PRIVATE_KEY } from '$env/static/private';
import jwt from 'jsonwebtoken';
import { Duration } from 'luxon';
import { sql } from 'bun';
import { FetchResult, permissions, themePrefer, userStatus } from '$lib/share';
import { json } from '@sveltejs/kit';
import type { RequestEvent } from "@sveltejs/kit";
import type { PartOfUser } from '@/lib/share/user';

export async function POST({ request, cookies }: RequestEvent) {

    let user: PartOfUser;
    if (import.meta.env.DEV) {
        user = {
            id: 125,
            username: '写作大师9527',
            phone_number: '13012011000'
        } as PartOfUser;
    } else {

        const { phoneNumber, captcha }: { phoneNumber: string, captcha: string } = await request.json();

        if (phoneNumber === '' || captcha === '') {
            return json(FetchResult.fail('需填写手机号和验证码'))
        }

        if (!await checkCaptcha(phoneNumber, captcha)) {
            return json(FetchResult.fail('验证码错误或过期，请重试'))
        }

        user = await loginOrRegisterUser(phoneNumber);


    }
    const token = jwt.sign({
        id: user.id,
        username: user.username,
        phoneNumber: user.phone_number
    }, SERVER_PRIVATE_KEY, { expiresIn: '1Week' });

    cookies.set('jwt', token, {
        path: '/', sameSite: 'strict', httpOnly: true,
        secure: import.meta.env.PROD,
        maxAge: Duration.fromObject({ weeks: 1 }).as('seconds')
    });

    return json(FetchResult.success(user));
}


async function checkCaptcha(phoneNumber: string, captcha: string): Promise<boolean> {
    const sms: {
        phone_number: string,
    }[] = await sql`
SELECT sc.* FROM public.sms_captcha AS sc
WHERE phone_number = ${phoneNumber} and  code = ${captcha} and is_used = false and expires_at > now()
limit 1`;

    if (sms.length > 0) {
        await sql`
update public.sms_captcha set is_used = true where phone_number = ${phoneNumber};`;
        return true;
    }

    return false;
}

async function loginOrRegisterUser(phoneNumber: string): Promise<PartOfUser> {

    const users: PartOfUser[] = await sql`
SELECT u.* FROM public.users AS u
WHERE phone_number = ${phoneNumber} and status = ${userStatus.enabled}
`.values();

    let user: PartOfUser;
    if (users.length <= 0) {
        // register user
        user = await registerUser(phoneNumber);
    } else {
        user = users[0];
    }

    return user;
}

async function registerUser(phoneNumber: string): Promise<PartOfUser> {
    const initUsername = `写作大师${phoneNumber.slice(-4)}`;

    const attributes = {
        "theme": themePrefer.light, "language": "zh", "permissions": [permissions.baseAccess]
    };

    const [user] = await sql`INSERT INTO users (username, email, password_hash, phone_number, balance, status, attributes) VALUES
    (${initUsername}, '', '', ${phoneNumber}, 0, ${userStatus.enabled}, ${JSON.stringify(attributes)})
    RETURNING *;`

    console.log(user);
    await sql`
    INSERT INTO user_roles (user_id, role_id)
    SELECT u.id, r.id 
    FROM users u, roles r 
    WHERE u.phone_number = ${phoneNumber} AND r.name = 'user'
    ON CONFLICT (user_id, role_id) DO NOTHING;`;

    return user;
}
