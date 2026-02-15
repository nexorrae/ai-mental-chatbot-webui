import { Button, Input, OutlinedCard, Select } from '../components/ui';

export function ProfilePage() {
  return (
    <div className="space-y-4">
      <OutlinedCard className="space-y-4">
        <h1 className="text-h4 font-semibold tracking-tight">Profile</h1>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input id="profile-name" label="Nama" defaultValue="Gilang" />
          <Input id="profile-email" label="Email" defaultValue="gilang@example.com" type="email" />
          <Select
            id="profile-tone"
            label="Gaya respons"
            options={[
              { value: 'warm', label: 'Hangat' },
              { value: 'direct', label: 'Langsung' }
            ]}
            defaultValue="warm"
          />
          <Select
            id="profile-language"
            label="Bahasa"
            options={[
              { value: 'id', label: 'Bahasa Indonesia' },
              { value: 'en', label: 'English' }
            ]}
            defaultValue="id"
          />
        </div>
        <Button variant="primary" className="w-full sm:w-auto">Simpan profil</Button>
      </OutlinedCard>
    </div>
  );
}
