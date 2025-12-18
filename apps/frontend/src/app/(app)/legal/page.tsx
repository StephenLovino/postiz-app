import Link from 'next/link';

export default function LegalPage() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-4">
      <h1 className="text-3xl font-semibold mb-4">About AHA Social Manager</h1>
      <p>
        AHA Social Manager is a rebranded fork of the open-source project{' '}
        <Link
          href="https://github.com/gitroomhq/postiz-app"
          className="underline"
          target="_blank"
        >
          Postiz
        </Link>
        , licensed under the GNU Affero General Public License v3.0 (AGPL-3.0).
      </p>
      <p>
        Under the terms of the AGPL, you have the right to access, modify, and
        redistribute the source code of this service.
      </p>
      <p>
        You can view the full source code for this deployment at:{' '}
        <Link
          href="https://github.com/StephenLovino/aha-social-manager"
          className="underline"
          target="_blank"
        >
          https://github.com/StephenLovino/aha-social-manager
        </Link>
        .
      </p>
      <p>
        For more details about the AGPL-3.0 license, see the{' '}
        <Link
          href="https://www.gnu.org/licenses/agpl-3.0.en.html"
          className="underline"
          target="_blank"
        >
          official license text
        </Link>
        .
      </p>
    </div>
  );
}



